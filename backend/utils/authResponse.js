const toSafeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    _id:
      user._id,

    username:
      user.username,

    email:
      user.email,

    displayName:
      user.displayName || "",

    avatar:
      user.avatar || "",

    bio:
      user.bio || "",



    // ======================================
    // Authentication
    // ======================================

    authProvider:
      user.authProvider ||
      "local",



    // ======================================
    // Role
    // ======================================

    /*
     * Keep existing role for backward
     * compatibility.
     */

    role:
      user.role ||
      "reader",



    /*
     * Compatible roles representation.
     */

    roles:
      Array.isArray(
        user.roles
      ) &&
      user.roles.length
        ? user.roles
        : [
            user.role ||
              "reader",
          ],



    // ======================================
    // Account Status
    // ======================================

    verified:
      Boolean(
        user.verified
      ),

    isActive:
      Boolean(
        user.isActive
      ),



    // ======================================
    // Writer Profile
    // ======================================

    writerProfile:
      user.writerProfile || {
        penName: "",

        joinedAsWriter:
          null,
      },



    // ======================================
    // Login Information
    // ======================================

    lastLogin:
      user.lastLogin ||
      null,



    // ======================================
    // Timestamps
    // ======================================

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
};



module.exports = {
  toSafeUser,
};