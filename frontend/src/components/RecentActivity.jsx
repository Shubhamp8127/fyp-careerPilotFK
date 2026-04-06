import React from "react";
import {
  Lightbulb,
  ClipboardCheck,
  TrendingUp,
  Activity,
  LogIn,
  User
} from "lucide-react";
import { useTranslation } from "react-i18next";

const iconMap = {
  recommendation: {
    icon: Lightbulb,
    color: "#22d3ee"
  },
  quiz: {
    icon: ClipboardCheck,
    color: "#a78bfa"
  },
  progress: {
    icon: TrendingUp,
    color: "#34d399"
  },
  login: {
    icon: LogIn,
    color: "#3b82f6"
  },
  profile_update: {
    icon: User,
    color: "#f59e0b"
  },
  default: {
    icon: Activity,
    color: "#64748b"
  }
};

const RecentActivity = ({ activities = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h3>{t("activity.title", "Recent Activity")}</h3>
        <span className="view-all">
          {t("activity.viewAll", "View All")}
        </span>
      </div>

      <div className="activity-list">
        {activities.map((item, index) => {
          const config = iconMap[item.type] || iconMap.default;
          const Icon = config.icon;

          return (
            <div key={index} className="activity-item">
              <div
                className="activity-icon"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <Icon size={18} color={config.color} />
              </div>

              <div className="activity-content">
                <p className="activity-text">
                  {item.message}
                  {/* 👉 agar backend message translate karna ho to:
                  {t(`activity.messages.${item.type}`, item.message)}
                  */}
                </p>

                <span className="activity-date">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <span className={`activity-badge ${item.type}`}>
                {t(`activity.types.${item.type}`, item.type)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;