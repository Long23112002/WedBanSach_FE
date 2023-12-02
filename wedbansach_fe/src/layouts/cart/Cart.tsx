import { Button, Checkbox, Input, Modal, Select, Space, Table } from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import HinHAnhModel from "../../models/HinhAnhModel";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Option, Record2 } from "react-bootstrap-icons";
import { Form } from "react-bootstrap";
import { log } from "console";
export interface CartItem {
  maSach?: any;
  tenSach?: any;
  giaBan?: any;
  soLuong?: any;
  thanhTien?: any;
  selected?: boolean;
  images?: HinHAnhModel[];
}

interface DiaChi {
  code: number;
  name: string;
}

const Cart: React.FC = () => {
  const [dataCart, setDataCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("");
  const [thanhPhoList, setThanhPhoList] = useState<DiaChi[]>([]);
  const [quanList, setQuanList] = useState<DiaChi[]>([]);
  const [huyenList, setHuyenList] = useState<DiaChi[]>([]);
  const [diaChiGiaoHang, setDiaChiGiaoHang] = useState({
    thanhPho: "",
    quan: "",
    huyen: "",
    diaChi: "",
  });
  const [clickGiaoHang, setclickGiaoHang] = useState<string | undefined>(
    undefined
  );
  const [totalAmountUpdate, setTotalAmountUpdate] = useState(0);

  const handleGiaoHang = (value: string) => {
    const giaGiaoHang = value === "1" ? 10000 : 0;
    setclickGiaoHang(giaGiaoHang.toString());
    const updatedTotalAmount = totalAmount + giaGiaoHang;
    setTotalAmountUpdate(updatedTotalAmount);
  };

  const showModal = () => {
    const cartItems = Cookies.get("cartItems");
    if (cartItems && cartItems.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
      Swal.fire({
        title: "Bạn chưa có sản phẩm nào trong giỏ hàng!",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          setOpen(false);
          console.log("long");
        }
      });
    }
  };

  useEffect(() => {
    const userName = localStorage.getItem("user");

    if (userName !== null) {
      const fetchData = async () => {
        try {
          const api = `http://localhost:8080/tai-khoan/check-dia-chi-giao-hang/${userName}`;
          const response = await fetch(api, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.text();
          // console.log(data);
          // setDiaChiGiaoHang(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    } else {
      // setDiaChiGiaoHang("");
    }
  }, [open]);

  useEffect(() => {
    console.log(diaChiGiaoHang);
  }, [diaChiGiaoHang]);
  const handleOk = () => {
    console.log(diaChiGiaoHang);

    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      alert("OK");
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  useEffect(() => {
    const dataCartCookies = Cookies.get("cartItems");
    if (dataCartCookies) {
      try {
        let parsedData = JSON.parse(dataCartCookies);
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
        setDataCart(
          dataArray.map((item: CartItem) => ({
            ...item,
            selected: false,
            soLuong: item.soLuong,
            thanhTien: item.giaBan,
          }))
        );
      } catch (error) {
        console.error("Error parsing data from cookies:", error);
      }
    }
  }, []);

  const handleCheckboxChange = (e: CheckboxChangeEvent, record: CartItem) => {
    const updatedDataCart = dataCart.map((item) => {
      if (item.tenSach === record.tenSach) {
        return {
          ...item,
          selected: e.target.checked,
        };
      }
      return item;
    });

    setDataCart(updatedDataCart);
  };

  const handleRemoveButtonClick = (record: CartItem) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Bạn có chắc chắn muốn xoá ${record.tenSach} khỏi giỏ hàng ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedDataCart = dataCart.filter(
          (item) => item.tenSach !== record.tenSach
        );
        setDataCart(updatedDataCart);

        const updatedCookieData = JSON.stringify(updatedDataCart);
        Cookies.set("cartItems", updatedCookieData);

        toast.success(` ${record.tenSach} đã được xoá khỏi giỏ hàng.`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
  };

  const handleQuantityIncrement = (record: CartItem) => {
    setDataCart((prevDataCart) => {
      const updatedDataCart = prevDataCart.map((item) => {
        if (item.tenSach === record.tenSach) {
          const newQuantity = item.soLuong + 1;
          const newThanhTien = item.giaBan * newQuantity;
          return {
            ...item,
            soLuong: newQuantity,
            thanhTien: newThanhTien,
          };
        }
        return item;
      });

      updateCookie(updatedDataCart);
      return updatedDataCart;
    });
  };

  const handleQuantityDecrement = (record: CartItem) => {
    setDataCart((prevDataCart) => {
      const updatedDataCart = prevDataCart.map((item) => {
        if (item.tenSach === record.tenSach && item.soLuong > 1) {
          const newQuantity = item.soLuong - 1;
          const newThanhTien = item.giaBan * newQuantity;
          return {
            ...item,
            soLuong: newQuantity,
            thanhTien: newThanhTien,
          };
        }
        return item;
      });

      updateCookie(updatedDataCart);
      return updatedDataCart;
    });
  };

  const updateCookie = (cartData: CartItem[]) => {
    const updatedCookieData = JSON.stringify(cartData);
    Cookies.set("cartItems", updatedCookieData);
  };

  const columns = [
    {
      title: "Chọn sách",
      dataIndex: "selected",
      render: (selected: boolean, record: CartItem) => (
        <Checkbox
          checked={selected}
          onChange={(e: CheckboxChangeEvent) => handleCheckboxChange(e, record)}
        />
      ),
    },
    {
      title: "Sản Phẩm",
      dataIndex: "tenSach",
      key: "tenSach",
      render: (_: any, record: CartItem) => (
        <div>
          <p>{record.tenSach}</p>
          <img
            src={record.images && record.images[0]?.duLieuAnh}
            alt={record.tenSach}
            style={{ maxWidth: "50px" }}
          />
        </div>
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSach",
      key: "tenSach",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      render: (_: any, record: CartItem) => (
        <Space>
          <Button onClick={() => handleQuantityDecrement(record)}>-</Button>
          <span style={{ margin: "0 8px" }}>{record.soLuong}</span>
          <Button onClick={() => handleQuantityIncrement(record)}>+</Button>
        </Space>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "giaBan",
      key: "giaBan",
    },
    {
      title: "Thành tiền",
      dataIndex: "thanhTien",
      key: "thanhTien",
      render: (_: any, record: CartItem) => <span>{record.thanhTien}</span>,
    },
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (_: any, record: CartItem) => (
        <div>
          <Button
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => handleRemoveButtonClick(record)}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((response) => response.json())
      .then((data) => setThanhPhoList(data))
      .catch((error) => console.error("Error fetching thành phố:", error));
  }, []);

  const handleThanhPhoChange = (value: number) => {
    console.log("Selected Thanh Pho:", value);
  
    fetch(`https://provinces.open-api.vn/api/p/${value}?depth=2`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Quan Data:", data);
  
        const quanData = data.districts;
        console.log("Quan Data check:", quanData);
        
        setQuanList(quanData);
  
        setDiaChiGiaoHang((prevState) => ({
          ...prevState,
          thanhPho: data.name,
          quan: "",
          huyen: "",
        }));
      })
      .catch((error) => console.error("Error fetching quận:", error));
  };

  console.log(diaChiGiaoHang);
  

  const handleQuanChange = (value: any) => {
    fetch(`https://provinces.open-api.vn/api/d/${value}?depth=2`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Quan Data: " +value);
        const huyenData = data.districts || [];
        console.log("Huyen Data: " +huyenData);
        setHuyenList(huyenData);
        
      })
      .catch((error) => console.error("Error fetching huyện:", error));

    setDiaChiGiaoHang((prevState) => ({
      ...prevState,
      quan: value,
      huyen: "",
    }));
  };

  const selectedItems = dataCart.filter((item) => item.selected);
  const totalAmount =
    selectedItems.length > 0
      ? selectedItems.reduce((sum, item) => sum + item.thanhTien, 0)
      : 0;

  const handlePay = () => {};

  return (
    <div>
      <ToastContainer />
      <div
        className="text-center mx-auto"
        style={{
          width: "60%",
          margin: "40px 0",
          border: "none",
          boxShadow: "0 0 4px grey",
        }}
      >
        <h1 style={{ margin: "20px 0" }}>Giỏ Hàng của bạn</h1>
        <Table dataSource={dataCart} columns={columns} />
      </div>

      <div
        className="payment text-right mx-auto"
        style={{
          border: "none",
          width: "60%",
          height: "100px",
          boxShadow: "0 0 4px grey",
        }}
      >
        <div
          style={{ padding: "26px 0" }}
          className="d-flex justify-content-center align-items-center"
        >
          Tổng thanh toán ({selectedItems.length} sản phẩm): {totalAmount} đ
          <Button
            style={{ margin: "0 20px" }}
            type="primary"
            onClick={showModal}
          >
            Thanh toán
          </Button>
          <Modal
            title={
              <div style={{ margin: "20px 0" }}>
                Bạn vui lòng chọn địa chỉ thanh toán và phương thức thanh toán
              </div>
            }
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okText="Thanh toán"
          >
            <p>
              <Input
                style={{ marginTop: "20px" }}
                placeholder="Tên người nhận"
                // value={modalText}
                // onChange={handleInputChange}
              />
              <Input
                style={{ marginTop: "20px" }}
                placeholder="Số điện thoại người nhận"
                // value={modalText}
                // onChange={handleInputChange}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr ",
                  gap: "10px",
                }}
              >
                <Select
                  style={{ marginTop: "20px" }}
                  placeholder="Chọn thành phố"
                  onChange={(value) => handleThanhPhoChange(value)}
                  options={
                    thanhPhoList &&
                    thanhPhoList.map((thanhPho) => ({
                      label: thanhPho.name,
                      value: thanhPho.code,
                    }))
                  }
                >
                  {thanhPhoList.map((thanhPho) => (
                    <Option key={thanhPho.code}>{thanhPho.name}</Option>
                  ))}
                </Select>
                <Select
                  style={{ marginTop: "20px" }}
                  placeholder="Chọn quận"
                  value={diaChiGiaoHang.quan}
                  onChange={(value) => handleQuanChange(value)}
                >
                  {quanList && quanList.map((quan) => (
                    <Option key={quan.code}>{quan.name}</Option>
                  ))}
                </Select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <Input
                  style={{ marginTop: "20px" }}
                  placeholder="Chọn huyện"
                  // value={diaChiGiaoHang}
                  // setDiaChiGiaoHang(e.target.value);
                  // }}onChange={(e) => {
                  //   
                />

                <Input
                  style={{ marginTop: "20px" }}
                  placeholder="Địa chỉ giao hàng"
                  // value={diaChiGiaoHang}
                  // onChange={(e) => {
                  //   setDiaChiGiaoHang(e.target.value);
                  // }}
                />
              </div>
              <Form.Select
                style={{ marginTop: "20px" }}
                aria-label="Chọn hình thức giao hàng"
                onChange={(e) => handleGiaoHang(e.target.value)}
              >
                <option value="">Chọn hình thức giao hàng</option>
                <option value="1">Giao hàng tận giường</option>
                <option value="2">Tự lấy hàng tại cửa hàng</option>
              </Form.Select>

              <Form.Select
                style={{ marginTop: "20px" }}
                aria-label="Chọn hình thức thanh toán"
              >
                <option value="">Chọn hình thức thanh toán</option>
                <option value="1">Cash</option>
                <option value="2">Transfer</option>
              </Form.Select>
              <div
                className="d-flex justify-content-center"
                style={{ fontSize: "20px", padding: "20px 0px" }}
              >
                <strong>
                  {" "}
                  Tổng tiền phí vận chuyển :{" "}
                  <span style={{ color: "red" }}>{clickGiaoHang}</span>{" "}
                  <sup>đ</sup>
                </strong>
              </div>
              <div
                className="d-flex justify-content-center"
                style={{ fontSize: "20px" }}
              >
                <strong>
                  {" "}
                  Tổng tiền phải thanh toán :{" "}
                  <span style={{ color: "red" }}>{totalAmountUpdate}</span>{" "}
                  <sup>đ</sup>
                </strong>
              </div>
            </p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Cart;
