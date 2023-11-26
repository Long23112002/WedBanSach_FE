import React, { useEffect, useState } from "react";
import { Star, StarFill } from "react-bootstrap-icons";
import DanhGiaModel from "../../../models/DanhGiaModel";
import { layToanBoDanhGiaCuaMotSach } from "../../../api/HinhAnhAPI";
import renderRating from "../../utils/SaoXepHang";

interface DanhGiaSanPham {
    maSach: number;
}

const DanhGiaSanPham: React.FC<DanhGiaSanPham> = (props) => {

    const maSach: number = props.maSach;

    const [danhSachDanhGia, setdanhSachDanhGia] = useState<DanhGiaModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);

    useEffect(() => {
        layToanBoDanhGiaCuaMotSach(maSach).then(
            danhSachDanhGia => {
                setdanhSachDanhGia(danhSachDanhGia);
                setDangTaiDuLieu(false);
            }
        ).catch(
            error => {
                setDangTaiDuLieu(false);
                setBaoLoi(error.message);
            }
        );
    }, [] // Chi goi mot lan
    )

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

    return (
        <div className="container mt-2 mb-2 text-center">
            <h4>Đánh giá sản phẩm: </h4>
            {
                danhSachDanhGia.map((danhGia, index) => (
                    <div className="row">
                        <div className="col-4  text-end">
                            <p>{renderRating(danhGia.diemXepHang?danhGia.diemXepHang:0)}</p>
                        </div>
                        <div className="col-8 text-start">
                            <p>{danhGia.nhanXet}</p>
                        </div>
                    </div>
                )
                )
            }

        </div>
    );
}
export default DanhGiaSanPham;