const crypto = require("crypto");
const https = require("https");

const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");
const RefreshSession = require("../models/RefreshSession");
const ApiError = require("../utils/ApiError");

const {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
  getRefreshExpiryDate,
} = require("../utils/tokenUtils");

const {
  createEmailVerificationToken,
} = require("./emailVerificationService");

// ======================================
// Google OAuth Client
// ======================================

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// ======================================
// Create Session
// ======================================

const createSession = async ({
  user,
  userAgent,
  ipAddress,
}) => {
  if (!user) {
    throw new ApiError(
      500,
      "Unable to create authentication session"
    );
  }

  const refreshToken = createRefreshToken();

  const tokenHash = hashRefreshToken(refreshToken);

  await RefreshSession.create({
    user: user._id,
    tokenHash,
    expiresAt: getRefreshExpiryDate(),
    userAgent: userAgent || "",
    ipAddress: ipAddress || "",
  });

  const accessToken = createAccessToken(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

// ======================================
// Register
// ======================================

const register = async ({
  username,
  email,
  password,
}) => {
  // ====================================
  // Normalize Input
  // ====================================

  const normalizedUsername =
    username
      .trim()
      .toLowerCase();

  const normalizedEmail =
    email
      .trim()
      .toLowerCase();

  // ====================================
  // Check Existing User
  // ====================================

  const existingUser =
    await User.findOne({
      $or: [
        {
          email: normalizedEmail,
        },
        {
          username: normalizedUsername,
        },
      ],
    });

  if (existingUser) {
    if (
      existingUser.email ===
      normalizedEmail
    ) {
      throw new ApiError(
        409,
        "Email already registered"
      );
    }

    throw new ApiError(
      409,
      "Username already registered"
    );
  }

  // ====================================
  // Create Local User
  // ====================================

  const user =
    await User.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      authProvider: "local",
      verified: false,
      isActive: true,
    });

  // ====================================
  // Send Verification Email
  // ====================================

  await createEmailVerificationToken(
    user
  );

  // ====================================
  // Registration Complete
  // ====================================

  return {
    user,
  };
};

// ======================================
// Login
// ======================================

const login = async ({
  email,
  password,
  userAgent,
  ipAddress,
}) => {
  // ====================================
  // Normalize Email
  // ====================================

  const normalizedEmail =
    email
      .trim()
      .toLowerCase();

  // ====================================
  // Find User
  // ====================================

  const user =
  await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  // ====================================
  // Validate Credentials
  // ====================================

  if (
    !user ||
    !(await user.matchPassword(password))
  ) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  // ====================================
  // Check Account Status
  // ====================================

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Account disabled"
    );
  }

  // ====================================
  // Check Email Verification
  // ====================================

  if (!user.verified) {
    throw new ApiError(
      403,
      "Please verify your email address before logging in."
    );
  }

  // ====================================
  // Update Last Login
  // ====================================

  user.lastLogin =
    new Date();

  await user.save();

  // ====================================
  // Create Authentication Session
  // ====================================

  return createSession({
    user,
    userAgent,
    ipAddress,
  });
};

// ======================================
// Generate Unique Username
// ======================================

const generateUniqueUsername = async (
  baseUsername
) => {
  let username = baseUsername
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");

  if (!username) {
    username = "lumorauser";
  }

  if (username.length < 3) {
    username = `${username}user`;
  }

  username = username.substring(0, 25);

  let candidate = username;
  let counter = 1;

  while (
    await User.exists({
      username: candidate,
    })
  ) {
    candidate =
      `${username}${counter}`;

    counter++;
  }

  return candidate;
};

// ======================================
// Google Login
// ======================================

const googleLogin = async ({
  credential,
  userAgent,
  ipAddress,
}) => {
  if (!credential) {
    throw new ApiError(
      400,
      "Google credential is required"
    );
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new ApiError(
      500,
      "Google authentication is not configured"
    );
  }

  let ticket;

  try {
    ticket =
      await googleClient.verifyIdToken({
        idToken: credential,
        audience:
          process.env.GOOGLE_CLIENT_ID,
      });
  } catch (error) {
    throw new ApiError(
      401,
      "Invalid Google credential"
    );
  }

  const payload =
    ticket.getPayload();

  if (!payload) {
    throw new ApiError(
      401,
      "Unable to verify Google account"
    );
  }

  const {
    sub: googleId,
    email,
    email_verified: emailVerified,
    name,
    picture,
  } = payload;

  if (!googleId || !email) {
    throw new ApiError(
      400,
      "Google account information is incomplete"
    );
  }

  if (!emailVerified) {
    throw new ApiError(
      403,
      "Google email address is not verified"
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  // --------------------------------------
  // Existing Google User
  // --------------------------------------

  let user = await User.findOne({
    googleId,
  });

  if (user) {
    if (!user.isActive) {
      throw new ApiError(
        403,
        "Your account has been deactivated"
      );
    }

    if (picture && !user.avatar) {
      user.avatar = picture;
    }

    user.verified = true;
    user.lastLogin = new Date();

    await user.save();

    return createSession({
      user,
      userAgent,
      ipAddress,
    });
  }

  // --------------------------------------
  // Existing Local Account
  // --------------------------------------

  const existingEmailUser =
    await User.findOne({
      email: normalizedEmail,
    });

  if (existingEmailUser) {
    throw new ApiError(
      409,
      "An account with this email already exists. Please login using your existing authentication method."
    );
  }

  // --------------------------------------
  // Create New Google User
  // --------------------------------------

  const baseUsername =
    name ||
    normalizedEmail.split("@")[0];

  const username =
    await generateUniqueUsername(
      baseUsername
    );

  /*
   * Google users do not need a password
   * for Google authentication.
   *
   * We still store a random internal password
   * because the User model requires password.
   */

  const randomPassword =
    crypto.randomBytes(32).toString("hex");

  user = await User.create({
    username,
    email: normalizedEmail,
    password: randomPassword,
    googleId,
    authProvider: "google",
    avatar: picture || "",
    verified: true,
    isActive: true,
    lastLogin: new Date(),
  });

  return createSession({
    user,
    userAgent,
    ipAddress,
  });
};

// ======================================
// Facebook Graph API Request
// ======================================

const facebookGraphRequest = ({
  path,
  query,
}) => {
  return new Promise(
    (resolve, reject) => {
      const queryString =
        new URLSearchParams(
          query || {}
        ).toString();

      const url =
        `https://graph.facebook.com${path}` +
        (queryString
          ? `?${queryString}`
          : "");

      const request =
        https.get(
          url,
          {
            headers: {
              Accept:
                "application/json",
            },
          },
          (response) => {
            let body = "";

            response.on(
              "data",
              (chunk) => {
                body += chunk;
              }
            );

            response.on(
              "end",
              () => {
                let data;

                try {
                  data = JSON.parse(body);
                } catch (error) {
                  return reject(
                    new Error(
                      "Invalid response from Facebook"
                    )
                  );
                }

                if (
                  response.statusCode < 200 ||
                  response.statusCode >= 300
                ) {
                  const message =
                    data?.error?.message ||
                    "Facebook API request failed";

                  return reject(
                    new Error(message)
                  );
                }

                resolve(data);
              }
            );
          }
        );

      request.setTimeout(
        10000,
        () => {
          request.destroy();

          reject(
            new Error(
              "Facebook API request timed out"
            )
          );
        }
      );

      request.on(
        "error",
        (error) => {
          reject(error);
        }
      );
    }
  );
};

// ======================================
// Facebook Login
// ======================================

const facebookLogin = async ({
  accessToken,
  userAgent,
  ipAddress,
}) => {
  if (!accessToken) {
    throw new ApiError(
      400,
      "Facebook access token is required"
    );
  }

  const appId =
    process.env.FACEBOOK_APP_ID;

  const appSecret =
    process.env.FACEBOOK_APP_SECRET;

  if (!appId || !appSecret) {
    throw new ApiError(
      500,
      "Facebook authentication is not configured"
    );
  }

  // --------------------------------------
  // Create Facebook App Access Token
  // --------------------------------------

  const appAccessToken =
    `${appId}|${appSecret}`;

  // --------------------------------------
  // Verify User Access Token
  // --------------------------------------

  let debugData;

  try {
    debugData =
      await facebookGraphRequest({
        path: "/debug_token",
        query: {
          input_token:
            accessToken,
          access_token:
            appAccessToken,
        },
      });
  } catch (error) {
    throw new ApiError(
      401,
      "Unable to verify Facebook access token"
    );
  }

  const tokenData =
    debugData?.data;

  if (!tokenData?.is_valid) {
    throw new ApiError(
      401,
      "Invalid Facebook access token"
    );
  }

  if (
    String(tokenData.app_id) !==
    String(appId)
  ) {
    throw new ApiError(
      401,
      "Facebook access token belongs to another application"
    );
  }

  const facebookId =
    tokenData.user_id;

  if (!facebookId) {
    throw new ApiError(
      401,
      "Facebook user information is missing"
    );
  }

  // --------------------------------------
  // Fetch Facebook Profile
  // --------------------------------------

  let profile;

  try {
    profile =
      await facebookGraphRequest({
        path:
          `/${facebookId}`,
        query: {
          fields:
            "id,name,email,picture.type(large)",
          access_token:
            accessToken,
        },
      });
  } catch (error) {
    throw new ApiError(
      401,
      "Unable to retrieve Facebook account information"
    );
  }

  if (!profile?.id) {
    throw new ApiError(
      401,
      "Facebook account information is incomplete"
    );
  }

  if (
    String(profile.id) !==
    String(facebookId)
  ) {
    throw new ApiError(
      401,
      "Facebook account verification failed"
    );
  }

  const email =
    profile.email
      ?.trim()
      .toLowerCase();

  if (!email) {
    throw new ApiError(
      400,
      "Facebook did not provide an email address. Please use another login method."
    );
  }

  const avatar =
    profile.picture?.data?.url ||
    "";

  // --------------------------------------
  // Existing Facebook User
  // --------------------------------------

  let user =
    await User.findOne({
      facebookId,
    });

  if (user) {
    if (!user.isActive) {
      throw new ApiError(
        403,
        "Your account has been deactivated"
      );
    }

    if (avatar) {
      user.avatar = avatar;
    }

    user.verified = true;
    user.lastLogin = new Date();

    await user.save();

    return createSession({
      user,
      userAgent,
      ipAddress,
    });
  }

  // --------------------------------------
  // Existing Account With Same Email
  // --------------------------------------

  const existingEmailUser =
    await User.findOne({
      email,
    });

  if (existingEmailUser) {
    throw new ApiError(
      409,
      "An account with this email already exists. Please login using your existing authentication method."
    );
  }

  // --------------------------------------
  // Generate Username
  // --------------------------------------

  const baseUsername =
    profile.name ||
    email.split("@")[0];

  const username =
    await generateUniqueUsername(
      baseUsername
    );

  // --------------------------------------
  // Random Internal Password
  // --------------------------------------

  const randomPassword =
    crypto.randomBytes(32).toString("hex");

  // --------------------------------------
  // Create Facebook User
  // --------------------------------------

  user = await User.create({
    username,
    email,
    password: randomPassword,
    facebookId,
    authProvider: "facebook",
    avatar,
    verified: true,
    isActive: true,
    lastLogin: new Date(),
  });

  return createSession({
    user,
    userAgent,
    ipAddress,
  });
};

// ======================================
// Rotate Session
// ======================================

const rotateSession = async ({
  refreshToken,
  userAgent,
  ipAddress,
}) => {
  if (!refreshToken) {
    throw new ApiError(
      401,
      "Refresh token is required"
    );
  }

  const tokenHash =
    hashRefreshToken(
      refreshToken
    );

  const session =
    await RefreshSession.findOne({
      tokenHash,
    }).populate("user");

  if (!session) {
    throw new ApiError(
      401,
      "Invalid refresh session"
    );
  }

  if (session.revokedAt) {
    throw new ApiError(
      401,
      "Refresh session has been revoked"
    );
  }

  if (
    session.expiresAt <=
    new Date()
  ) {
    throw new ApiError(
      401,
      "Refresh session has expired"
    );
  }

  const user =
    session.user;

  if (!user) {
    throw new ApiError(
      401,
      "User account not found"
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account has been deactivated"
    );
  }

  // --------------------------------------
  // Revoke Old Refresh Session
  // --------------------------------------

  session.revokedAt =
    new Date();

  await session.save();

  // --------------------------------------
  // Create New Session
  // --------------------------------------

  return createSession({
    user,
    userAgent,
    ipAddress,
  });
};

// ======================================
// Revoke Session
// ======================================

const revokeSession = async ({
  refreshToken,
}) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash =
    hashRefreshToken(
      refreshToken
    );

  await RefreshSession.updateOne(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    }
  );
};

// ======================================
// Revoke All Sessions
// ======================================

const revokeAllSessions =
  async (userId) => {
    await RefreshSession.updateMany(
      {
        user: userId,
        revokedAt: null,
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      }
    );
  };

// ======================================
// Change Password
// ======================================

const changePassword = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  // ====================================
  // Find User With Password
  // ====================================

  const user =
    await User.findById(
      userId
    ).select("+password");

  // ====================================
  // Check User
  // ====================================

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  // ====================================
  // Check Current Password
  // ====================================

  const isCurrentPasswordValid =
    await user.matchPassword(
      currentPassword
    );

  if (!isCurrentPasswordValid) {
    throw new ApiError(
      401,
      "Current password is incorrect"
    );
  }

  // ====================================
  // Set New Password
  // ====================================

  user.password =
    newPassword;

  // Keep existing authentication provider
  user.authProvider =
    user.authProvider ||
    "local";

  // ====================================
  // Save User
  // ====================================
  //
  // User.js pre-save middleware will
  // automatically bcrypt-hash the new password.
  //
  await user.save();

  // ====================================
  // Revoke All Existing Sessions
  // ====================================

  await revokeAllSessions(
    user._id
  );

  return user;
};

// ======================================
// Become Writer
// ======================================

const becomeWriter = async ({
  userId,
  userAgent,
  ipAddress,
}) => {
  const user =
    await User.findById(
      userId
    );

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  if (
    user.role === "writer"
  ) {
    throw new ApiError(
      409,
      "Already a writer"
    );
  }

  user.role =
  "writer";

user.roles = ["writer"];

user.writerProfile = {
    penName:
      user.writerProfile?.penName ||
      user.username,

    joinedAsWriter:
      user.writerProfile
        ?.joinedAsWriter ||
      new Date(),
  };

  await user.save();

  /*
   * Authorization level changed,
   * therefore revoke existing sessions.
   */

  await revokeAllSessions(
    user._id
  );

  return createSession({
    user,
    userAgent,
    ipAddress,
  });
};

// ======================================
// Exports
// ======================================

module.exports = {
  register,
  login,
  googleLogin,
  facebookLogin,
  createSession,
  rotateSession,
  revokeSession,
  revokeAllSessions,
  changePassword,
  becomeWriter,
};