import React, { useEffect, useState } from "react";
import AdminMenu from "../AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };
  useEffect(() => {
    getAllCategory();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const itemData = new FormData();
      itemData.append("name", name);
      itemData.append("price", price);
      itemData.append("quantity", quantity);
      itemData.append("photo", photo);
      itemData.append("category", category);

      const { data } = axios.post(
        `${process.env.REACT_APP_API}/api/v1/items/create-items`,
        itemData
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Item created Successfully");
        navigate("/dashboard/admin/items");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="container-fluid m-3 p-3">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>Create Items</h1>
          <div className="m-1 w-75">
            <Select
              bordered={false}
              placeholder="Select a Category"
              size="large"
              showSearch
              className="form-select mb-3"
              onChange={(value) => {
                setCategory(value);
              }}
            >
              {categories?.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>
            <div className="mb-3">
              <label className="btn btn-outline-secondary col-md-12">
                {photo ? photo.name : "Upload Photo"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
            </div>
            <div className="mb-3">
              {photo && (
                <div className="text-c">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="item_photo"
                    height={"200px"}
                    className="img img-responsive"
                  />
                </div>
              )}
            </div>
            <div className="mb-3">
              <input
                type="text"
                value={name}
                placeholder=" Item Name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                value={price}
                placeholder=" Item Price"
                className="form-control"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="number"
                value={quantity}
                placeholder=" Item Quantity"
                className="form-control"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" onClick={handleCreate}>
                CREATE ITEM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
