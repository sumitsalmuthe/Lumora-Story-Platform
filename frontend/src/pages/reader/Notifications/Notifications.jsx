import { useEffect, useState } from "react";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaBookOpen,
  FaUserGroup,
  FaHeart,
  FaComment,
} from "react-icons/fa6";

import apiClient from "../../../services/api/apiClient";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        const response =
          await apiClient.get("/notifications");

        console.log(
          "NOTIFICATIONS RESPONSE:",
          response.data
        );

        if (cancelled) {
          return;
        }

        const data =
          response?.data?.notifications ||
          response?.data?.data?.notifications ||
          response?.data?.data ||
          [];

        setNotifications(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Load notifications error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            "Unable to load notifications."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  const handleMarkAsRead = async (
    notificationId
  ) => {
    if (!notificationId || actionLoading) {
      return;
    }

    try {
      setActionLoading(notificationId);

     await apiClient.put(
  `/notifications/${notificationId}/read`
);

      setNotifications((current) =>
        current.map((notification) => {
          const id =
            notification?._id ||
            notification?.id;

          if (
            String(id) !==
            String(notificationId)
          ) {
            return notification;
          }

          return {
            ...notification,
            isRead: true,
            read: true,
          };
        })
      );
    } catch (err) {
      console.error(
        "Mark notification read error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to mark notification as read."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading("all");

      await apiClient.put(
  "/notifications/read-all"
);

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
          read: true,
        }))
      );
    } catch (err) {
      console.error(
        "Mark all notifications read error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to mark all notifications as read."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================

  const handleDelete = async (
    notificationId
  ) => {
    if (!notificationId || actionLoading) {
      return;
    }

    try {
      setActionLoading(notificationId);

      await apiClient.delete(
        `/notifications/${notificationId}`
      );

      setNotifications((current) =>
        current.filter((notification) => {
          const id =
            notification?._id ||
            notification?.id;

          return (
            String(id) !==
            String(notificationId)
          );
        })
      );
    } catch (err) {
      console.error(
        "Delete notification error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to delete notification."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  const getNotificationIcon = (
    notification
  ) => {
    const type =
      String(
        notification?.type ||
          notification?.notificationType ||
          ""
      ).toLowerCase();

    if (
      type.includes("follow")
    ) {
      return <FaUserGroup size={14} />;
    }

    if (
      type.includes("like")
    ) {
      return <FaHeart size={14} />;
    }

    if (
      type.includes("comment") ||
      type.includes("reply")
    ) {
      return <FaComment size={14} />;
    }

    if (
      type.includes("story") ||
      type.includes("chapter")
    ) {
      return <FaBookOpen size={14} />;
    }

    return <FaBell size={14} />;
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <main className="lumora-notifications">
        <div className="lumora-notifications__container">
          <div className="lumora-notifications__loading">
            Loading notifications...
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="lumora-notifications">
      <div className="lumora-notifications__container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="lumora-notifications__header">

          <div>
            <span className="lumora-notifications__eyebrow">
              YOUR ACTIVITY
            </span>

            <h1>Notifications</h1>

            <p>
              Stay updated with your Lumora activity.
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              type="button"
              className="lumora-notifications__read-all"
              onClick={handleMarkAllAsRead}
              disabled={
                actionLoading === "all"
              }
            >
              <FaCheck size={11} />

              {actionLoading === "all"
                ? "Please wait..."
                : "Mark all as read"}
            </button>
          )}

        </header>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="lumora-notifications__error">
            {error}
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {notifications.length === 0 ? (
          <section className="lumora-notifications__empty">

            <div className="lumora-notifications__empty-icon">
              <FaBell size={24} />
            </div>

            <h2>
              No notifications yet
            </h2>

            <p>
              When something happens on Lumora,
              you'll see it here.
            </p>

          </section>
        ) : (

          /* =================================================
             LIST
          ================================================= */

          <section className="lumora-notifications__list">

            {notifications.map(
              (notification) => {
                const id =
                  notification?._id ||
                  notification?.id;

                const isRead =
                  notification?.isRead === true ||
                  notification?.read === true;

                const title =
                  notification?.title ||
                  notification?.message ||
                  "New notification";

                const message =
                  notification?.message ||
                  notification?.description ||
                  "";

                const createdAt =
                  notification?.createdAt ||
                  notification?.date;

                return (
                  <article
                    key={id}
                    className={`lumora-notifications__item ${
                      !isRead
                        ? "lumora-notifications__item--unread"
                        : ""
                    }`}
                  >

                    {/* ICON */}

                    <div className="lumora-notifications__icon">
                      {getNotificationIcon(
                        notification
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="lumora-notifications__content">

                      <h3>
                        {title}
                      </h3>

                      {message &&
                        message !== title && (
                          <p>
                            {message}
                          </p>
                        )}

                      <span>
                        {formatDate(
                          createdAt
                        )}
                      </span>

                    </div>

                    {/* ACTIONS */}

                    <div className="lumora-notifications__actions">

                      {!isRead && (
                        <button
                          type="button"
                          className="lumora-notifications__action"
                          onClick={() =>
                            handleMarkAsRead(
                              id
                            )
                          }
                          disabled={
                            actionLoading === id
                          }
                          title="Mark as read"
                        >
                          <FaCheck size={11} />
                        </button>
                      )}

                      <button
                        type="button"
                        className="lumora-notifications__action"
                        onClick={() =>
                          handleDelete(id)
                        }
                        disabled={
                          actionLoading === id
                        }
                        title="Delete notification"
                      >
                        <FaTrash size={11} />
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </section>
        )}

      </div>
    </main>
  );
}

export default Notifications;