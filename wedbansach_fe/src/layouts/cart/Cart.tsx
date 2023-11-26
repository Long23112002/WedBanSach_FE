import { Button, Checkbox, Input, Modal, Select, Space, Table } from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import HinHAnhModel from "../../models/HinhAnhModel";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Option } from "react-bootstrap-icons";
import { Form } from "react-bootstrap";
export interface CartItem {
  maSach?: any;
  tenSach?: any;
  giaBan?: any;
  soLuong?: any;
  thanhTien?: any;
  selected?: boolean;
  images?: HinHAnhModel[];
}

const Cart: React.FC = () => {
  const [dataCart, setDataCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("");

  const showModal = () => {
    const cartItems = Cookies.get('cartItems'); 
    if (cartItems && cartItems.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
      Swal.fire({
        title: "Bạn chưa có sản phẩm nào trong giỏ hàng!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          setOpen(false);
          console.log("long")
        }
      });
    }
  };
  const handleOk = () => {
    
    
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      alert('OK')
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
          <Button style={{margin :"0 20px"}} type="primary" onClick={showModal}>
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
              <Input
                style={{ marginTop: "20px" }}
                placeholder="Nhập địa chỉ giao hàng"
                // value={modalText}
                // onChange={handleInputChange}
              />

              {/* Dropdown (Combo box) của Ant Design */}
              <Form.Select
                style={{ marginTop: "20px" }}
                aria-label="Chọn hình thức giao hàng"
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
            </p>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Cart;
