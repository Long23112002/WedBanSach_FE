import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { error } from "console";
import HinhAnhSanPham from "./components/HinhAnhSanPham";
import DanhGiaSanPham from "./components/DanhGiaSanPham";
import renderRating from "../utils/SaoXepHang";
import dinhDanhSo from "../utils/DinhDangSo";
import dinhDangSo from "../utils/DinhDangSo";
import SachModel from "../../models/SachModel";
import { laySachTheoMaSach } from "../../api/SachAPI";
import Cookies from "js-cookie";
import { lay1AnhCuaMotSach } from "../../api/HinhAnhAPI";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { Button, Modal } from "antd";

const ChiTietSanPham: React.FC = () => {
  // Lấy mã sách từ URL
  const { maSach } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  let maSachNumber = 0;
  try {
    maSachNumber = parseInt(maSach + "");
    if (Number.isNaN(maSachNumber)) maSachNumber = 0;
  } catch (error) {
    maSachNumber = 0;
    console.error("Error", error);
  }

  // Khai báo
  const [sach, setSach] = useState<SachModel | null>(null);
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
  const [baoLoi, setBaoLoi] = useState(null);
  const [soLuong, setSoLuong] = useState(1);

  const tangSoLuong = () => {
    const soLuongTonKho = sach && sach.soLuong ? sach.soLuong : 0;
    if (soLuong < soLuongTonKho) {
      setSoLuong(soLuong + 1);
    }
  };
  const giamSoLuong = () => {
    if (soLuong > 1) {
      setSoLuong(soLuong - 1);
    }
  };

  const handleSoLuongChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const soLuongMoi = parseInt(event.target.value);
    const soLuongTonKho = sach && sach.soLuong ? sach.soLuong : 0;
    if (!isNaN(soLuongMoi) && soLuongMoi >= 1 && soLuongMoi <= soLuongTonKho) {
      setSoLuong(soLuongMoi);
    }
  };

  const handleMuaNgay = () => {};

  useEffect(() => {
    laySachTheoMaSach(maSachNumber)
      .then((sach) => {
        setSach(sach);
        setDangTaiDuLieu(false);
      })
      .catch((error) => {
        setBaoLoi(error.message);
        setDangTaiDuLieu(false);
      });
  }, [maSach]);

  if (dangTaiDuLieu) {
    return (
      <div>
        {/* <h1>Đang tải dữ liệu</h1> */}
      </div>
    );
  }

  if (baoLoi) {
    return (
      <div>
        <h1>Gặp lỗi: {baoLoi}</h1>
      </div>
    );
  }

  if (!sach) {
    return (
      <div>
        <h1>Sách không tồn tại!</h1>
      </div>
    );
  }

  const handleThemVaoGioHang = async () => {
    const checkLogin = localStorage.getItem("token");
    if (checkLogin != null) {
      try {
        const existingCartItems = Cookies.get("cartItems");
        const cartItems = existingCartItems
          ? JSON.parse(existingCartItems)
          : [];

        const existingItemIndex = cartItems.findIndex(
          (item1: { maSach: number }) => item1.maSach === maSachNumber
        );

        const imageModels = await lay1AnhCuaMotSach(sach.maSach);

        if (existingItemIndex !== -1) {
          cartItems[existingItemIndex].soLuong += soLuong;

          Swal.fire({
            icon: "success",
            title: "Đã thêm vào giỏ hàng!",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          const newItem = {
            maSach: maSachNumber,
            tenSach: sach.tenSach,
            giaBan: sach.giaBan ?? 0,
            soLuong: soLuong,
            thanhTien: (sach.giaBan ?? 0) * soLuong,
            images: imageModels,
          };
          cartItems.push(newItem);

          console.log("test");
          Swal.fire({
            icon: "success",
            title: "Đã thêm vào giỏ hàng!",
            showConfirmButton: false,
            timer: 1500,
          });
        }

        Cookies.set("cartItems", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Error handling addToCart:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Có lỗi xảy ra. Vui lòng thử lại!",
        });
      }
    } else {
        showModal();
    }
  };

  return (
    <div className="container">
      <div className="row mt-4 mb-4">
        <div className="col-4">
          <HinhAnhSanPham maSach={maSachNumber} />
        </div>
        <div className="col-8">
          <div className="row">
            <div className="col-8">
              <h1>{sach.tenSach}</h1>
              <h4>
                {renderRating(
                  sach.trungBinhXepHang ? sach.trungBinhXepHang : 0
                )}
              </h4>
              <h4>{dinhDanhSo(sach.giaBan)} đ</h4>
              <hr />
              <div dangerouslySetInnerHTML={{ __html: sach.moTa + "" }} />
              <hr />
            </div>
            <div className="col-4">
              <div>
                <div className="mb-2">Số lượng</div>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-secondary me-2"
                    onClick={giamSoLuong}
                  >
                    -
                  </button>
                  <input
                    className="form-control text-center"
                    type="number"
                    value={soLuong}
                    min={1}
                    onChange={handleSoLuongChange}
                  />
                  <button
                    className="btn btn-outline-secondary ms-2"
                    onClick={tangSoLuong}
                  >
                    +
                  </button>
                </div>
                {sach.giaBan && (
                  <div className="mt-2 text-center">
                    Số tiền tạm tính <br />
                    <h4>{dinhDangSo(soLuong * sach.giaBan)} đ</h4>
                  </div>
                )}
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-danger mt-3"
                    onClick={handleMuaNgay}
                  >
                    Mua ngay
                  </button>
                  {/* <button
                    type="button"
                    className="btn btn-outline-secondary mt-2"
                    onClick={handleThemVaoGioHang}
                  >
                    Thêm vào giỏ hàng
                  </button> */}

                  <Button type="primary" onClick={handleThemVaoGioHang}>
                    Thêm vào giỏ hàng
                  </Button>
                  <Modal
                    title="Vui Lòng Đăng Nhập !"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <p>
                      Bạn chưa đăng nhập để thực hiện mua hàng bạn vui lòng
                      click <a href="/dang-nhap">Đăng nhập</a> ở đây để đăng
                      nhập.
                    </p>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4 mb-4">
        <DanhGiaSanPham maSach={maSachNumber} />
      </div>
    </div>
  );
};
export default ChiTietSanPham;
