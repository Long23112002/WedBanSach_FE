import { log } from "console";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function KichHoatTaiKhoan() {
  const { email } = useParams();
  const { maKichHoat } = useParams();
  const [daKichHoat, setDaKichHoat] = useState(false);
  const [thongBao, setThongBao] = useState("");

  useEffect(() => {
    console.log("Email:", email);
    console.log("MaKichHoat:", maKichHoat);
    if (email && maKichHoat) {
      thucHienKichHoat();
    }
  }, []);

  const thucHienKichHoat = async () => {
    console.log("Email:", email);
    console.log("MaKichHoat:", maKichHoat);
    try {
      const url: string = `http://localhost:8080/tai-khoan/kich-hoat?email=${email}&maKichHoat=${maKichHoat}`;
      const response = await fetch(url, { method: "GET" });

      if (response.ok) {
        setDaKichHoat(true);
      } else {
        setThongBao(
          "Kích hoạt tài khoản thất bại mã kích hoạt của bạn không đúng"
        );
      }
    } catch (error) {
      console.log("Lỗi khi kích hoạt: ", error);
    }
  };
  return (
    <div style={{margin : '20px 0'}}>
      <h1>Kích hoạt tài khoản</h1>
      {daKichHoat ? (
        <p>
          {" "}
          Tài khoản đã kích hoạt thành công, bạn hãy{" "}
          <a style={{ color: "red" }} href="/dang-nhap">
            Đăng nhập
          </a>{" "}
          để tiếp tục sử dụng dịch vụ!
        </p>
      ) : (
        <p>{thongBao}</p>
      )}
    </div>
  );
}

export default KichHoatTaiKhoan;
