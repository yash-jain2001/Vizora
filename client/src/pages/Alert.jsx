import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../components/layout/DashboardLayout";

import API from "../api/axios";

import socket from "../hooks/useSocket";

const Alerts = () => {

  const [alerts, setAlerts] =
    useState([])

  /* FETCH ALERTS */
  const fetchAlerts =
    async () => {

      try {

        const res =
          await API.get(
            '/alerts'
          )

        setAlerts(res.data)

      } catch (error) {

        console.log(error)

      }

    }

  useEffect(() => {
    fetchAlerts()
  }, [])

  /* LIVE ALERTS */
  useEffect(() => {

    socket.on(
      'new-alert',
      (alert) => {

        setAlerts((prev) => [
          alert,
          ...prev,
        ])

      }
    )

    return () => {
      socket.off(
        'new-alert'
      )
    }

  }, [])

  /* ACKNOWLEDGE */
  const acknowledgeAlert =
    async (id) => {

      try {

        await API.put(
          `/alerts/acknowledge/${id}`
        )

        fetchAlerts()

      } catch (error) {

        console.log(error)

      }

    }

  /* RESOLVE */
  const resolveAlert =
    async (id) => {

      try {

        await API.put(
          `/alerts/resolve/${id}`
        )

        fetchAlerts()

      } catch (error) {

        console.log(error)

      }

    }

  return (
    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-white mb-2">
          Notification Center
        </h1>

        <p className="text-gray-400">
          Realtime monitoring alerts
        </p>

      </div>

      <div className="flex flex-col h-[650px] scrollbar-none overflow-auto gap-6">

        {alerts.map(
          (alert) => (

            <div
              key={alert._id}
              className={`p-6 rounded-2xl border ${
                alert.severity ===
                'high'
                  ? 'bg-red-500/20 border-red-500'
                  : 'bg-yellow-500/20 border-yellow-500'
              } ${
                alert.resolved
                  ? 'opacity-50'
                  : ''
              }`}
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">

                <div>

                  <h2 className="text-2xl font-bold text-white">
                    {alert.title}
                  </h2>

                  <p className="text-gray-300 mt-2">
                    {alert.message}
                  </p>

                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm capitalize w-fit ${
                    alert.severity ===
                    'high'
                      ? 'bg-red-500 text-white'
                      : 'bg-yellow-500 text-black'
                  }`}
                >
                  {alert.severity}
                </span>

              </div>

              <div className="flex flex-wrap gap-4 items-center">

                <p className="text-sm text-gray-400">
                  Value:
                  {" "}
                  {alert.value}
                  °C
                </p>

                {alert.acknowledged && (
                  <span className="text-green-400 text-sm">
                    Acknowledged
                  </span>
                )}

                {alert.resolved && (
                  <span className="text-blue-400 text-sm">
                    Resolved
                  </span>
                )}

              </div>

              {/* ACTIONS */}
              {!alert.resolved && (
                <div className="flex gap-4 mt-6 flex-wrap">

                  {!alert.acknowledged && (
                    <button
                      onClick={() =>
                        acknowledgeAlert(
                          alert._id
                        )
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg text-black font-semibold"
                    >
                      Acknowledge
                    </button>
                  )}

                  <button
                    onClick={() =>
                      resolveAlert(
                        alert._id
                      )
                    }
                    className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg text-white font-semibold"
                  >
                    Resolve
                  </button>

                </div>
              )}

            </div>

          )
        )}

      </div>

    </DashboardLayout>
  );
};

export default Alerts;