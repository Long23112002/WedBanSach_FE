import React, { useEffect, useState } from "react";
import SachProps from "./components/SachProps";
import { error } from "console";
import { PhanTrang } from "../utils/PhanTrang";
import { layToanBoSach, timKiemSach } from "../../api/SachAPI";
import SachModel from "../../models/SachModel";
import img404 from '../../css/error-404.webp'
import { Spin } from "antd";


interface DanhSachSanPhamProps {
    tuKhoaTimKiem: string;
    maTheLoai: number;
}

function DanhSachSanPham({ tuKhoaTimKiem, maTheLoai }: DanhSachSanPhamProps) {

    const [danhSachQuyenSach, setDanhSachQuyenSach] = useState<SachModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [tongSoTrang, setTongSoTrang] = useState(0);
    const [tongSoSach, setSoSach] = useState(0);

    useEffect(() => {
        if (tuKhoaTimKiem === '' && maTheLoai==0) {
            layToanBoSach(trangHienTai - 1).then(
                kq => {
                    setDanhSachQuyenSach(kq.ketQua);
                    setTongSoTrang(kq.tongSoTrang);
                    setDangTaiDuLieu(false);
                }
            ).catch(
                error => {
                    setDangTaiDuLieu(false);
                    setBaoLoi(error.message);
                }
            );
        }else{
            timKiemSach(tuKhoaTimKiem, maTheLoai).then(
                kq => {
                    setDanhSachQuyenSach(kq.ketQua);
                    setTongSoTrang(kq.tongSoTrang);
                    setDangTaiDuLieu(false);
                }
            ).catch(
                error => {
                    setDangTaiDuLieu(false);
                    setBaoLoi(error.message);
                }
            );
        }
    }, [trangHienTai, tuKhoaTimKiem, maTheLoai]);

    const phanTrang = (trang: number) => {
        setTrangHienTai(trang);
    };

    //console.log(trangHienTai);

    if (dangTaiDuLieu) {
        return (
          <div style={{ margin: '80px 0' }}>
            <Spin size="large" /> 
          </div>
        );
    }

    if (baoLoi) {
        return (
            <div>
                {/* <h1>Gặp lỗi: {baoLoi}</h1> */}
                 <img style={{height:'25%' , width:'70%'}} src={img404}></img>
            </div>
        );
    }


    if(danhSachQuyenSach.length===0){
        return (
            <div className="container">
                <div className="d-flex align-items-center justify-content-center">
                    <h1>Hiện không tìm thấy sách theo yêu cầu!</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row mt-4 mb-4">
                {
                    danhSachQuyenSach.map((sach) => (
                        <SachProps key={sach.maSach} sach={sach} />
                    )
                    )
                }
            </div>
            <div className="d-flex justify-content-center">
            <PhanTrang trangHienTai={trangHienTai} tongSoTrang={tongSoTrang} phanTrang={phanTrang} />
            </div>
        </div>
    );
}

export default DanhSachSanPham;