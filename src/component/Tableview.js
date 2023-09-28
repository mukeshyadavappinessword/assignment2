import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Table from "react-bootstrap/Table";
import { ApexOptions } from "apexcharts";

const TableView = () => {
  const data = JSON.parse(localStorage.getItem("pokemon"));

  const [filterByname, setFilterByname] = useState([]);
  const [uniqueData, setUniqueData] = useState([]);
  const [stageLevel, setStageLevel] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const DynamicHeader =
    data && data?.length > 0 ? Object.keys(data[0]).slice(1) : [];

  useEffect(() => {
    if (
      !filteredData ||
      !Array.isArray(filteredData) ||
      filteredData.length === 0
    ) {
      console.log("No data available");
    }
  }, []);

  const handleFilter = (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = data?.filter((item) =>
      item.name.toLowerCase().includes(keyword)
    );
    setFilteredData(filtered);
  };

  const handleSort = (field) => {
    const sorted = [...filteredData].sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });

    if (sortBy === field) {
      setSortBy(null);
      setFilteredData([...filteredData].reverse());
    } else {
      setSortBy(field);
      setFilteredData(sorted);
    }
  };

  useEffect(() => {
    const uniqueData = data?.map((item) => item.types).flat();
    setUniqueData([...new Set(uniqueData)]);
  }, []);

  useEffect(() => {
    const stageLevel = data?.map((item) => item.stage).flat();
    setStageLevel([...new Set(stageLevel)]);
  }, []);

  const handleFiltercategory = (e) => {
    const keyword = e.target.value;
    const filtered = data?.filter((item) => {
      if (keyword === "") {
        return true;
      }
      if (item.types && Array.isArray(item.types)) {
        return item.types.includes(keyword === "" ? "" : keyword);
      }
      return false;
    });
    setFilteredData(filtered);
  };

  const handleFilterstage = (e) => {
    const keyword = e.target.value;
    const filtered = data?.filter((item) => {
      if (keyword === "") {
        return true;
      }
      if (item.stage) {
        return item.stage.includes(keyword);
      }
      return false;
    });
    setFilteredData(filtered);
  };

  // Create an object to store counts
  const counts = {};

  // Count the occurrences of each value
  data?.forEach((value) => {
    if (counts[value.stage]) {
      counts[value.stage] += 1;
    } else {
      counts[value.stage] = 1;
    }
  });

  // Convert counts to an array of objects
  const countArray = Object.entries(counts).map(([value, count]) => ({
    value,
    count,
  }));

  const sersss = countArray?.length > 0 ? countArray.map((val) => val.count) : [];

  const chartData = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: stageLevel,
    series: sersss,
  };

  return (
    <div className="dashboardWrapper">
      <div id="chart">
        <ReactApexChart
          options={chartData}
          type="pie"
          series={sersss}
        />
      </div>
      <div className="WrapperContainer">
        <div className="SelectWrapper">
          <label>
            <span className="filterName">Filter By Stage </span>
            <select onChange={handleFilterstage}>
              {stageLevel?.map((value, id) => {
                return (
                  <option key={id} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            <span className="filterName">Filter By Types </span>
            <select onChange={handleFiltercategory}>
              {uniqueData?.map((value, id) => {
                if (value != null) {
                  return (
                    <option key={id} value={value}>
                      {value != null && value}
                    </option>
                  );
                }
              })}
            </select>
          </label>

          <label>
            <span className="filterName">Filter By Name </span>
            <select onChange={handleFilter}>
              <option value={""}>All</option>
              {filterByname?.map((value) => {
                return <option key={value} value={value}>{value}</option>;
              })}
            </select>
          </label>
        </div>
        <div className="tablerMainWrapper">
          <Table className="table" striped bordered hover>
            <thead className="tableHeader">
              <tr>
                <th className="headerCell">S.No</th>
                {DynamicHeader?.map((value, index) => {
                  return (
                    <th
                      className="headerCell"
                      onClick={() => handleSort(value)}
                    >
                      {value}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="tbody">
              {filteredData?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.types}</td>
                  <td>{item.stage}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TableView;