import React, { ChangeEvent, useState } from "react";
import { Search } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import type { MenuProps } from "antd";
import { Badge, Dropdown, Space } from "antd";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

interface NavbarProps {
  tuKhoaTimKiem: string;
  setTuKhoaTimKiem: (tuKhoa: string) => void;
}

function Navbar({ tuKhoaTimKiem, setTuKhoaTimKiem }: NavbarProps) {
  const [tuKhoaTamThoi, setTuKhoaTamThoi] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [soLuongCart , setSoLuongCart] = useState(0);

  useEffect(() => {
    const storedCartItems = Cookies.get("cartItems");
    if (storedCartItems != null) {
      const parsedCartItems = JSON.parse(storedCartItems);
      setCartItems(parsedCartItems);
      const cartItemsLength = parsedCartItems.length;
      setSoLuongCart(cartItemsLength);
      console.log("Number of items in the cart:", cartItemsLength);
    }
  }, []);
  


  useEffect(() => {
    const cartItemsLength = cartItems.length;
    setSoLuongCart(cartItemsLength);
    console.log("a:", cartItemsLength);
  }, [cartItems]);



  // lấy token từ localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = jwtDecode(token);
      console.log(userData);
      if (userData) {
        setUsername(userData.sub + "");
      }
    }
  }, []);

  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTuKhoaTamThoi(e.target.value);
    setTuKhoaTimKiem(tuKhoaTamThoi);
    if (e.target.value === "") setTuKhoaTimKiem("");
  };
  const items: MenuProps["items"] = [
    {
      label: <a href="/dang-nhap">Đăng Nhập</a>,
      key: "0",
    },
    {
      label: <a href="/dang-ky">Đăng ký</a>,
      key: "1",
    },
    {
      type: "divider",
    },
  ];
  const rgbColor = `rgb(${255}, ${255}, ${255} , ${0.55})`;

  const handleSearch = () => {
    setTuKhoaTimKiem(tuKhoaTamThoi);
  };

  const handelDangXuat = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const items1: MenuProps["items"] = [
    {
      label: <a href="#">Hồ Sơ cá nhân</a>,
      key: "0",
    },
    {
      label: (
        <a href="/" onClick={handelDangXuat}>
          Đăng Xuất
        </a>
      ),
      key: "1",
    },
  ];

   const handelTest = () =>{
    console.log(soLuongCart)
   }



  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid" style={{ margin: "0 20px" }}>
        <a className="navbar-brand" href="/">
          Bookstore
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link active" aria-current="page" to="/">
                Trang chủ
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdown1"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Thể loại sách
              </NavLink>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">
                <li>
                  <NavLink className="dropdown-item" to="/1">
                    Thể loại 2
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/2">
                    Thể loại 3
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/3">
                    Thể loại 4
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                // href="#"
                id="navbarDropdown2"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Quy định bán hàng
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown2">
                <li>
                  <a className="dropdown-item" href="#">
                    Quy định 1
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Quy định 2
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Quy định 3
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        {/* Tìm kiếm */}
        <div className="d-flex">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Tìm kiếm"
            aria-label="Search"
            onChange={onSearchInputChange}
            value={tuKhoaTamThoi}
          />
          <button
            className="btn btn-outline-success"
            type="button"
            onClick={handleSearch}
          >
            <Search />
          </button>
        </div>

        {/* Biểu tượng giỏ hàng */}
        <ul style={{ padding: "0 20px" }} className="navbar-nav me-1">
          <li className="nav-item">

            <Badge count={soLuongCart}>
              <a className="nav-link" href="/cart">
                <i className="fas fa-shopping-cart"></i>
              </a>
            </Badge>
          </li>
        </ul>

        {/* Biểu tượng đăng nhập */}
        {username ? (
          <Dropdown menu={{ items: items1 }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <div>
                  <div style={{ color: "white" }}>Xin chào, {username}</div>
                </div>
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        ) : (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <i style={{ color: rgbColor }} className="fas fa-user"></i>
              </Space>
            </a>
          </Dropdown>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
