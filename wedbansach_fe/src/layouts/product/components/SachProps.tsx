import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HinHAnhModel from "../../../models/HinhAnhModel";
import { lay1AnhCuaMotSach } from "../../../api/HinhAnhAPI";
import dinhDangSo from "../../utils/DinhDangSo";
import renderRating from "../../utils/SaoXepHang";
import SachModel from "../../../models/SachModel";
import { Button, Modal } from "antd";
import Cookies from "js-cookie";
import { laySachTheoMaSach } from "../../../api/SachAPI";

interface SachPropsInterface {
  sach: SachModel;
}

const SachProps: React.FC<SachPropsInterface> = (props) => {
  const navigate = useNavigate();
  const maSach: number = props.sach.maSach;

  const [danhSachAnh, setDanhSachAnh] = useState<HinHAnhModel[]>([]);
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
  const [baoLoi, setBaoLoi] = useState(null);
  const [status, setStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isHeartRed, setIsHeartRed] = useState(false);

  const toggleHeartColor = () => {
    setIsHeartRed(!isHeartRed);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchBookDetails = async (maSach: number) => {
    const tokenCheckLogin = localStorage.getItem("token");
    if (tokenCheckLogin != null) {
      try {
        const existingCartItems = Cookies.get("cartItems");
        const existingCartItemsArray = existingCartItems
          ? JSON.parse(existingCartItems)
          : [];
        const existingCartItemIndex = existingCartItemsArray.findIndex(
          (item: any) => item.maSach === maSach
        );

        const productDetails = await laySachTheoMaSach(maSach);
        const images = await lay1AnhCuaMotSach(maSach);

        let updatedCartItems = [...existingCartItemsArray];

        if (existingCartItemIndex !== -1) {
          updatedCartItems[existingCartItemIndex].soLuong += 1;
        } else {
          updatedCartItems.push({
            ...productDetails,
            images,
            soLuong: 1,
          });
        }

        Cookies.set("cartItems", JSON.stringify(updatedCartItems));
        setCartItems(updatedCartItems);

        console.log(updatedCartItems);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    }
  };

  useEffect(() => {
    lay1AnhCuaMotSach(maSach)
      .then((hinhAnhData) => {
        console.log(hinhAnhData);
        setDanhSachAnh(hinhAnhData);
        setDangTaiDuLieu(false);
      })
      .catch((error) => {
        setDangTaiDuLieu(false);
        setBaoLoi(error.message);
      });
  }, []);

  useEffect(() => {
    lay1AnhCuaMotSach(maSach)
      .then((hinhAnhData) => {
        console.log(hinhAnhData);
        setDanhSachAnh(hinhAnhData);
        setDangTaiDuLieu(false);
      })
      .catch((error) => {
        setDangTaiDuLieu(false);
        setBaoLoi(error.message);
      });
  }, []);

  if (dangTaiDuLieu) {
    return (
      <div>
        {/* <h1>Đang tải dữ liệu</h1> */}
      </div>
    );
  }

  if (baoLoi) {
    return <div>{/* <h1>Gặp lỗi: {baoLoi}</h1> */}</div>;
  }

  let duLieuAnh: string = "";
  if (danhSachAnh[0] && danhSachAnh[0].duLieuAnh) {
    duLieuAnh = danhSachAnh[0].duLieuAnh;
  }

  const HandelMuaHang = () => {
    const token = localStorage.getItem("token");
    fetchBookDetails(props.sach.maSach);
    if (token !== null) {
      navigate("/");

      setStatus(true);
    }
    if (token === null) {
      showModal();
    }
  };

  return (
    <div className="col-md-3 mt-5">
      <div className="card" style={{ boxShadow:'0 0 4px grey'}}>
        <Link to={`/sach/${props.sach.maSach}`}>
          <img
            src={duLieuAnh}
            className="card-img-top"
            alt={props.sach.tenSach}
            style={{ height: "200px" }}
          />
        </Link>
        <div className="card-body">
          <Link
            to={`/sach/${props.sach.maSach}`}
            style={{ textDecoration: "none" }}
          >
            <h5 className="card-title">{props.sach.tenSach}</h5>
          </Link>

          <div className="price row">
            <span className="original-price col-6 text-end" >
              <del style={{margin:'10px -60px'}} >{dinhDangSo(props.sach.giaNiemYet)} <sup>đ</sup></del>
            </span>
            <span className="discounted-price col-6 text-end"  >
              <strong style={{fontSize:'20px' ,color:"red"}} >{dinhDangSo(props.sach.giaBan)}  <sup>đ</sup></strong>
            </span>
          </div>
          <div className="row mt-2" role="group">
            <hr style={{height:'3px'}}></hr>
            <div className="col-6">
              {renderRating(
                props.sach.trungBinhXepHang ? props.sach.trungBinhXepHang : 0
              )}
            </div>
            <div className="col-6 text-end">
              <button
                style={{backgroundColor:'white',border:'none' , fontSize:'30px'}}
                className={`btn btn-secondary btn-block me-2 ${
                  isHeartRed ? "text-danger" : "text-secondary"
                }`}
                onClick={toggleHeartColor}
              >
                <i
                  className={`fas fa-heart ${isHeartRed ? "color:red" : ""}`}
                ></i>
              </button>
              <Button
                className="btn btn-danger btn-block"
                onClick={HandelMuaHang}
              >
                <i className="fas fa-shopping-cart"></i>
              </Button>
              <Modal
                title="Vui Lòng Đăng Nhập !"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <p>
                  Bạn chưa đăng nhập để thực hiện mua hàng bạn vui lòng click{" "}
                  <a href="/dang-nhap">Đăng nhập</a> ở đây để đăng nhập.
                </p>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SachProps;
