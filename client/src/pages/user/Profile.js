import React, { useEffect, useState } from "react";
import UserMenu from "../UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [profilePhoto, setProfilePhoto] = useState(
    localStorage.getItem("profilePhoto") || null
  );
  const [photoSelected, setPhotoSelected] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  // Function to handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
      // You can add code here to handle the file (e.g., upload to server, preview, etc.)
    }
  };

  const handlePhotoReset = () => {
    setProfilePhoto(null);
    setPhotoSelected(false);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/auth/profile`,
        {
          name,
          email,
          password,
          phone,
          address,
          profilePhoto,
        }
      );

      if (data?.errro) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // Set user data to state if available
  React.useEffect(() => {
    if (auth?.user) {
      setEmail(auth.user.email || "");
      setName(auth.user.name || "");
      setPhone(auth.user.phone || "");
      setAddress(auth.user.address || "");
    }
  }, [auth]);

  // Fetch the user's profile photo when the component mounts
  useEffect(() => {
    fetchProfilePhoto();
  }, []);

  const fetchProfilePhoto = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/profile-photo/${auth?.user?._id}`
      );
      setProfilePhoto(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid m-3 p-3">
      <div className="row">
        <div className="col-md-3">
          <UserMenu />
        </div>
        <div className="col-md-9">
          <h1>Your Profile</h1>
          <div className="d-flex align-items-center mb-3">
            <div
              className="rounded-circle overflow-hidden position-relative"
              style={{ width: "150px", height: "150px" }}
            >
              {profilePhoto ? (
                <div className="position-relative">
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-link btn-sm position-absolute top-0 end-0"
                    onClick={handlePhotoReset}
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#f2f2f2",
                    cursor: "pointer",
                  }}
                >
                  <i
                    className="bi bi-plus-lg position-absolute"
                    style={{ fontSize: "40px" }}
                  ></i>
                  <label htmlFor="photoInput">Upload Photo</label>
                  <input
                    type="file"
                    id="photoInput"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handlePhotoUpload}
                  />
                </div>
              )}
            </div>
            <div className="ms-3">
              <h4>{name}</h4>
              <p>{phone}</p>
              <p>{address}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
