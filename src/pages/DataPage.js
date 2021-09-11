import React, { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { COLUMNS } from "../components/columns";
import { getData } from "../lib/Api";
import moment from "moment";
import "./DataPage.css";

const DataPage = () => {
  const [spotData, setSpotData] = useState([]);
  const [futureData, setFutureData] = useState([]);
  const [updatedTime, setUpdatedTime] = useState("");
  const [displayData, setDisplayData] = useState("spot");

  useEffect(() => {
    fetchData();
    // Refresh data every 10s
    const refreshData = setInterval(() => fetchData(), 10000);
    // Disable refreshing data after page close
    return () => {
      clearInterval(refreshData);
    };
  }, []);

  async function fetchData() {
    const result = await getData();
    console.log("result", result);
    formatData(result);
    setUpdatedTime(moment(new Date()).format("DD/MM/YYYY HH:mm:ss"));
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formatPrice = (x) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatData = (res) => {
    let spotDataCopy = [];
    let futureDataCopy = [];
    console.log("res", res);
    res.result.forEach((item) => {
      const asset = ["BTC", "ETH", "SOL", "FTT", "ADA"];
      const format = (data) => {
        return {
          name: data.name,
          bid: formatPrice(data.bid),
          ask: formatPrice(data.ask),
          price: formatPrice(data.price),
          underlying: data.underlying || "-",
          volumeUsd24h: formatter.format(data.volumeUsd24h),
        };
      };
      if (item.type === "spot") {
        if (
          asset.includes(item.baseCurrency) ||
          asset.includes(item.quoteCurrency)
        ) {
          spotDataCopy.push(format(item));
          // setSpotData((spotData) => [...spotData, format(item)]);
        }
      }
      if (item.type === "future") {
        if (asset.includes(item.underlying)) {
          futureDataCopy.push(format(item));
          // setFutureData((futureData) => [...futureData, format(item)]);
        }
      }
    });
    setSpotData(spotDataCopy);
    setFutureData(futureDataCopy);
  };
  console.log("spotData", spotData);
  console.log("futureData", futureData);

  const columns = useMemo(() => COLUMNS, []);
  // const data = useMemo(() => spotData, []);

  const display = displayData === "spot" ? spotData : futureData;

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: display,
    });

  return (
    <div className="pageWrapper">
      <div className="typeNavBar">
        <div
          className={
            // "typeNavLink"
            displayData === "future"
              ? "typeNavLink typeNavLinkSelected"
              : "typeNavLink"
          }
          onClick={() => {
            if (displayData !== "future") {
              setDisplayData("future");
            }
          }}
        >
          FUTURES
        </div>
        <div
          className={
            // "typeNavLink"
            displayData === "spot"
              ? "typeNavLink typeNavLinkSelected"
              : "typeNavLink"
          }
          onClick={() => {
            if (displayData !== "spot") {
              setDisplayData("spot");
            }
          }}
        >
          SPOT
        </div>
      </div>
      <div className="subsection">
        <button className="refreshBtn" onClick={() => fetchData()}>
          Refresh
        </button>
        <div className="updatedTime">Last Updated: {updatedTime}</div>
      </div>
      <div className="tableWrapper">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              return (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPage;
