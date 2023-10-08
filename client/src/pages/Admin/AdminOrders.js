import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../AdminMenu.js";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Processed",
    "Processing",
    "Out for delivery",
    "Delivered",
    "Cancel",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/all-orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);
  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`,
        {
          status: value,
        }
      );
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Orders</h1>
          {orders?.map((o, i) => {
            return (
              <div className="border shadow">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Name</th>
                      <th scope="col">Date</th>
                      {/* <th scope="col">Payment</th> */}
                      <th scope="col">Phone Number</th>
                      <th scope="col">Home Address</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          bordered={false}
                          onChange={(value) => handleChange(o._id, value)}
                          defaultValue={o?.status}
                        >
                          {status.map((s, i) => (
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>
                        {o?.name && o?.name.includes("(COD)") ? (
                          <span style={{ color: "green" }}>{o?.name}</span>
                        ) : (
                          o?.name
                        )}
                      </td>

                      <td>
                        {moment(o?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                      </td>
                      {/* <td>{o?.payment?.success ? "Success" : "Failed"}</td> */}

                      <td>{o?.phoneNumber}</td>
                      <td>{o?.homeAddress}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="container">
                  {o?.products?.map((p, i) => (
                    <div className="row mb-2 p-3 card flex-row">
                      <div className="col-md-4">
                        <img
                          src={`${process.env.REACT_APP_API}/api/v1/items/item-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          width={"50px"}
                          height={"200px"}
                        />
                      </div>
                      <div className="col-md-8">
                        <p>{p.name}</p>
                        <p>price : ₹{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
