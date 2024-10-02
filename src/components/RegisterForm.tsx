/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../helper/validation/formValidator";
import { useAuth } from "../context/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, user,error,updateError } = useAuth();
  useEffect(() => {
    if (user?._id) {
      navigate("/");
    }
    if(error){
        toast.error(error)
    }
  }, [navigate, user,error]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePassword = () => setShowPassword(!showPassword);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  //event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      updateError()
      const formData = new FormData(e.currentTarget);
      const formJson = Object.fromEntries((formData as any).entries());
      const { name, email, password } = formJson;
      if (!validateName(name)) {
        toast.error("Name is required");
        return;
      }
      if (!validateEmail(email)) {
        toast.error("Enter a valid email");
        return;
      }
      if (!validatePassword(password)) {
        toast.error("password need more than 8 charchters");
        return;
      }
      console.log("here");
      
      await register({ name, email, password });
    //   navigate("/");
    } catch (err: any) {
      toast.error("Something went wrong", err);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="relative m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]"
    >
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Register for an Account
        </h1>
        <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
          Create an account. Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300"
          >
            Login here
          </Link>
        </p>
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 text-[#999]">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            name="name"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            placeholder="John Doe"
          />
        </div>
        <div className="mt-[1rem] flex flex-col">
          <label htmlFor="email" className="mb-1 text-[#999]">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            name="email"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            placeholder="johndoe@gmail.com"
          />
        </div>
        <div className="relative mt-[1rem] flex flex-col">
          <label htmlFor="password" className="mb-1 text-[#999]">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
            placeholder="***************"
          />

          <Icon
            icon={showPassword ? `mdi:eye-off` : `mdi:eye`}
            width={24}
            height={24}
            className="absolute cursor-pointer p-1 right-4 top-[51%]  text-[#999] "
            onClick={togglePassword}
          />
        </div>

        <div className="flex">
          <button
            type="submit"
            disabled={
              !formData.name ||
              !formData.email||
              !formData.password
            }
            className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors"
          >
            Register Now
          </button>
        </div>
      </div>
      <img src="/flurry.png" alt="" />
    </form>
  );
};

export default RegisterForm;
