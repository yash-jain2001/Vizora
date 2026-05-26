import { useEffect, useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";

import API from "../api/axios";

const Datasources = () => {

  const [datasources, setDatasources] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    url: '',
    topic: '',
  })

  const fetchDatasources = async () => {

    try {

      const res = await API.get('/datasources')

      setDatasources(res.data)

    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    fetchDatasources()
  }, [])

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await API.post('/datasources', formData)

      fetchDatasources()

      setFormData({
        name: '',
        type: '',
        url: '',
        topic: '',
      })

    } catch (error) {
      console.log(error)
    }

  }

  return (
    <DashboardLayout>

      <h1 className="text-4xl text-white font-bold mb-8">
        Datasources
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#1F2937] p-6 rounded-2xl mb-8"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            type="text"
            name="name"
            placeholder="Datasource Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded bg-[#374151] text-white"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="p-3 rounded bg-[#374151] text-white"
          >
            <option value="">Select Type</option>
            <option value="mqtt">MQTT</option>
            <option value="http">HTTP</option>
            <option value="influxdb">InfluxDB</option>
            <option value="opcua">OPCUA</option>
          </select>

          <input
            type="text"
            name="url"
            placeholder="Datasource URL"
            value={formData.url}
            onChange={handleChange}
            className="p-3 rounded bg-[#374151] text-white"
          />

          <input
            type="text"
            name="topic"
            placeholder="MQTT Topic"
            value={formData.topic}
            onChange={handleChange}
            className="p-3 rounded bg-[#374151] text-white"
          />

        </div>

        <button
          type="submit"
          className="mt-6 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white font-semibold"
        >
          Add Datasource
        </button>

      </form>

      {/* LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {datasources.map((source) => (

          <div
            key={source._id}
            className="bg-[#1F2937] p-6 rounded-2xl border border-[#374151]"
          >

            <h2 className="text-2xl font-bold text-white mb-2">
              {source.name}
            </h2>

            <p className="text-gray-400">
              Type: {source.type}
            </p>

            <p className="text-gray-400">
              URL: {source.url}
            </p>

            {source.topic && (
              <p className="text-gray-400">
                Topic: {source.topic}
              </p>
            )}

          </div>

        ))}

      </div>

    </DashboardLayout>
  );
};

export default Datasources;