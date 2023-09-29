import React, { useState, useEffect } from "react";
import AdminMenu from "../AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Items = () => {
  const [items, setItems] = useState([]);

  //get all items
  const getAllItems = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/items/get-items`
      );
      setItems(data.items);
    } catch (error) {
      console.log(error);
      toast.error("Someething Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllItems();
  }, []);
  return (
    <div className="row dashboard">
      <div className="col-md-3">
        <AdminMenu />
      </div>
      <div className="col-md-9">
        <h1 className="text-center">Item List</h1>
        <div className="d-flex flex-wrap">
          {items?.map((p) => (
            <Link
              key={p._id}
              to={`/dashboard/admin/items/${p.slug}`}
              className="item-link"
            >
              <div className="card m-5" style={{ width: "50%" }}>
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/items/item-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Items;
