import React, { useEffect, useState } from "react";
import UserMenu from "../UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/orders`
      );
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);
  return (
    <div className="container-fluid p-3 m-3">
      <div className="row">
        <div className="col-md-3">
          <UserMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center"> ALL ORDERS</h1>
          {orders?.map((o, i) => {
            return (
              <div className="border shadow">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>

                      <th scope="col">Name</th>
                      <th scope="col">Status</th>
                      <th scope="col">Date</th>
                      {/* <th scope="col">Payment</th> */}
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <th>{o?.buyer?.name}</th>
                      <td>{o?.status}</td>

                      <td>
                        {moment(o?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                      </td>
                      {/* <td>
                        {console.log("Payment Status:", o?.payment?.status)}
                        {o?.payment?.status ? o.payment.status : "Failed"}
                      </td> */}
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
    </div>
  );
};

export default Orders;
