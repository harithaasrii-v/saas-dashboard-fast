import "./Components/AppShell/AppShell.js";
import "./Components/Activity/ActivityTable.js";
import "./Components/Alert/AlertList.js";
import "./Components/DashboardCards/MetricCard.js";
import "./Components/Modal/AppModal.js";
import "./Components/Notification/ToastContainer.js";
import "./Components/Notification/ToastMessage.js";
import "./Components/Services/ServiceStatus.js";

const metricCards = document.querySelectorAll("metric-card[data-metric]");

async function loadDashboardMetrics() {
  try {
    const [activityResponse, alertsResponse, servicesResponse] =
      await Promise.all([
        fetch("/Data/activity.json"),
        fetch("/Data/alerts.json"),
        fetch("/Data/services.json"),
      ]);

    if (
      ![activityResponse, alertsResponse, servicesResponse].every(
        (response) => response.ok,
      )
    ) {
      throw new Error("Unable to load dashboard metrics");
    }

    const [activity, alerts, services] = await Promise.all([
      activityResponse.json(),
      alertsResponse.json(),
      servicesResponse.json(),
    ]);

    // ─── Metric Card Calculations ──────────────────────────────
    const failedActions = activity.filter(
      (item) => item.status === "failed",
    ).length;

    const openAlerts = alerts.filter((alert) => alert.status === "open");

    const criticalAlerts = openAlerts.filter(
      (alert) => alert.severity === "critical",
    ).length;

    const averageResponseTime = services.length
      ? Math.round(
          services.reduce(
            (total, service) => total + Number(service.responseTimeMs || 0),
            0,
          ) / services.length,
        )
      : 0;

    const metrics = {
      "unique-users": {
        value: new Set(activity.map((item) => item.user)).size,
        trend: `${activity.length} recent events`,
        status: "healthy",
      },
      "response-time": {
        value: `${averageResponseTime} ms`,
        trend: `Across ${services.length} monitored services`,
        status: "healthy",
      },
      "active-alerts": {
        value: openAlerts.length,
        trend: `${criticalAlerts} critical`,
        status: criticalAlerts ? "critical" : "healthy",
      },
      "failure-rate": {
        value: `${activity.length ? ((failedActions / activity.length) * 100).toFixed(1) : "0.0"}%`,
        trend: `${failedActions} failed actions`,
        status: failedActions ? "warning" : "healthy",
      },
    };

    // ─── Push Data to Metric Cards ─────────────────────────────
    metricCards.forEach((card) => {
      card.data = { title: card.cardTitle, ...metrics[card.dataset.metric] };
    });

    // ─── Push Data to Components ───────────────────────────────
    document.querySelector("activity-table").data = activity;
    document.querySelector("alert-list").data = alerts;
    document.querySelector("service-status").data = services;
  } catch (error) {
    console.error(error);
  }
}

loadDashboardMetrics();
