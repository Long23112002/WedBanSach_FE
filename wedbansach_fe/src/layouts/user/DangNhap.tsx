import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Flex } from "antd";
import { Button as AntButton } from "antd";
const DangNhap = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadings, setLoadings] = useState<boolean[]>([]);
  

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const enterLoading = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      handleLogin();
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 2000);
  };

  const handleLogin = () => {
    const loginRequest = {
      username: username,
      password: password,
    };

    fetch("http://localhost:8080/tai-khoan/dang-nhap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Đăng nhập thất bại!");
        }
      })
      .then((data) => {
        const { jwt } = data;
        console.log(jwt);
        localStorage.setItem("token", jwt);
        localStorage.setItem("user", username);
        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công!",
          showConfirmButton: false,
          timer: 1000, 
        });

        setTimeout(() => {      
          navigate("/");
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại",
          text:
            error.message + " , vui lòng kiểm tra lại tài khoản và mật khẩu",
        });
      });
  };

  const styleBoder = {
    marginTop: 30,
    padding: 20,
    boxShadow: "0 0 4px grey",
    borderRadius: 20,
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="form-signin" style={{width :"40%"}}>
        <div className="border" style={styleBoder}>
          <h1 className="h3 mb-3 font-weight-normal">Đăng nhập</h1>
          <label className="sr-only">Tên đăng nhập</label>
          <input
            type="username"
            id="username"
            className="form-control mb-2"
            placeholder="Email address"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="sr-only">Password</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              id="inputPassword"
              className="form-control mb-2"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              style={{ border: 0, backgroundColor: "white", margin: "0 6px" }}
              className="position-absolute end-0 top-50 translate-middle-y"
              onClick={handleTogglePassword}
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </button>
          </div>
          <div className="checkbox mb-3 text-start">
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>

          <div className=" mb-3 text-start">
            <label>
              Nếu bạn chưa có tài khoản vui lòng ấn <a href="/dang-ky" style={{color:"blue"}}>Đăng ký</a> tại đây
            </label>
          </div>
          <Flex gap="small" wrap="wrap">
            <AntButton
              type="primary"
              loading={loadings[0]}
              onClick={() => enterLoading(0)}
            >
              Đăng Nhập
            </AntButton>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default DangNhap;
