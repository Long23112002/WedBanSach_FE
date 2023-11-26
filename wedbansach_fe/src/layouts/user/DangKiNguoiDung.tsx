import React, { useState } from "react";
import { Flex } from "antd";
import { Button as AntButton } from "antd";
import Swal from 'sweetalert2';

function DangKyNguoiDung() {
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [email, setEmail] = useState("");
  const [hoDem, setHoDen] = useState("");
  const [ten, setTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [matKhauLapLai, setMatKhauLapLai] = useState("");
  const [gioiTinh, setGioiTinh] = useState("M");

  // Các biến báo lỗi
  const [errorHoDem, setErrorHoDem] = useState("");
  const [errorTen, setErrorTen] = useState("");
  const [errorSoDienThoai, setErrorSoDienThoai] = useState("");
  const [errorGioiTinh, setErrorGioiTinh] = useState("");
  const [errorTenDangNhap, setErrorTenDangNhap] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorMatKhau, setErrorMatKhau] = useState("");
  const [errorMatKhauLapLai, setErrorMatKhauLapLai] = useState("");
  const [loadings, setLoadings] = useState<boolean[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {


    e.preventDefault();


    setErrorHoDem("");
    setErrorTen("");
    setErrorSoDienThoai("");
    setErrorGioiTinh("");
    setErrorTenDangNhap("");
    setErrorEmail("");
    setErrorMatKhau("");
    setErrorMatKhauLapLai("");

    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!hoDem) {
      setErrorHoDem("Họ đệm không được để trống");
    } else if (!nameRegex.test(hoDem)) {
      setErrorHoDem("Họ đệm chỉ được chứa chữ cái tiếng Việt hoặc tiếng Anh");
    }

    if (!ten) {
      setErrorTen("Tên không được để trống");
    } else if (!nameRegex.test(ten)) {
      setErrorTen("Tên chỉ được chứa chữ cái tiếng Việt hoặc tiếng Anh");
    }
    const phoneRegex = /^\d{10,11}$/;
    if (!soDienThoai) {
      setErrorSoDienThoai("Số điện thoại không được để trống");
    } else if (!phoneRegex.test(soDienThoai)) {
      setErrorSoDienThoai(
        "Sai định dạng số điện thoại số điện thoại phải có độ dài 10-11 số"
      );
    }
    if (!gioiTinh) setErrorGioiTinh("Giới tính không được để trống");
    if (!tenDangNhap) setErrorTenDangNhap("Tên đăng nhập không được để trống");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrorEmail("Email không được để trống");
    } else if (!emailRegex.test(email)) {
      setErrorEmail("Email không hợp lệ");
    }
    if (!matKhau) setErrorMatKhau("Mật khẩu không được để trống");
    if (!matKhauLapLai)
      setErrorMatKhauLapLai("Nhập lại mật khẩu không được để trống");

    // Additional validations
    const isTenDangNhapValid = !(await kiemTraTenDangNhapDaTonTai(tenDangNhap));
    const isEmailValid = !(await kiemTraEmailDaTonTai(email));
    const isMatKhauValid = !kiemTraMatKhau(matKhau);
    const isMatKhauLapLaiValid = !kiemTraMatKhauLapLai(matKhauLapLai);

    if (
      isTenDangNhapValid &&
      isEmailValid &&
      isMatKhauValid &&
      isMatKhauLapLaiValid
    ) {
      try {
        const url = "http://localhost:8080/tai-khoan/dang-ky";

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            tenDangNhap: tenDangNhap,
            email: email,
            matKhau: matKhau,
            hoDem: hoDem,
            ten: ten,
            soDienThoai: soDienThoai,
            gioiTinh: gioiTinh,
          }),
        });

        if (response.ok) {

          Swal.fire({
            icon: 'success',
            title: 'Đăng ký thành công!',
            text: 'Đăng kí thành công , vui lòng kiểm tra email để kích hoạt.',
          });
          setEmail("");
          setTen("");
          setHoDen("");
          setMatKhau("");
          setMatKhauLapLai("");
          setSoDienThoai("");
          setTenDangNhap("");
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Đăng ký thất bại!',
            text: 'Đã xảy ra lỗi trong quá trình đăng kí tài khoản vui lòng đăng kí lại.',
          });
          console.log(response.json());
        }
      } catch (error) {
          console.error(error);
      }
    }
  };

  // KIỂM TRA TÊN ĐĂNG NHẬP ////////////////////////////////////////////////
  const kiemTraTenDangNhapDaTonTai = async (tenDangNhap: string) => {
    // end-point
    const url = `http://localhost:8080/nguoi-dung/search/existsByTenDangNhap?tenDangNhap=${tenDangNhap}`;
    console.log(url);
    try {
      const response = await fetch(url);
      const data = await response.text();
      if (data === "true") {
        setErrorTenDangNhap("Tên đăng nhập đã tồn tại!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi khi kiểm tra tên đăng nhập:", error);
      return false; // Xảy ra lỗi
    }
  };

  const handleTenDangNhapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Thay đổi giá trị
    setTenDangNhap(e.target.value);
    // Kiểm tra
    setErrorTenDangNhap("");
    // Kiểm tra sự tồn tại
    return kiemTraTenDangNhapDaTonTai(e.target.value);
  };

  ///////////////////////////////////////////////////////////////////////////////

  // KIỂM TRA TÊN ĐĂNG NHẬP ////////////////////////////////////////////////
  const kiemTraEmailDaTonTai = async (email: string) => {
    // end-point
    const url = `http://localhost:8080/nguoi-dung/search/existsByEmail?email=${email}`;
    console.log(url);
    // call api
    try {
      const response = await fetch(url);
      const data = await response.text();
      if (data === "true") {
        setErrorEmail("Email đã tồn tại!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Lỗi khi kiểm tra email:", error);
      return false; // Xảy ra lỗi
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Thay đổi giá trị
    setEmail(e.target.value);
    // Kiểm tra
    setErrorEmail("");
    // Kiểm tra sự tồn tại
    return kiemTraEmailDaTonTai(e.target.value);
  };


  const kiemTraMatKhau = (matKhau: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(matKhau)) {
      setErrorMatKhau(
        "Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất 1 ký tự đặc biệt (!@#$%^&*)"
      );
      return true;
    } else {
      setErrorMatKhau("");
      return false;
    }
  };

  const handleMatKhauChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Thay đổi giá trị
    setMatKhau(e.target.value);
    // Kiểm tra
    setErrorMatKhau("");
    // Kiểm tra sự tồn tại
    return kiemTraMatKhau(e.target.value);
  };

  const kiemTraMatKhauLapLai = (matKhauLapLai: string) => {
    if (matKhauLapLai !== matKhau) {
      setErrorMatKhauLapLai("Mật khẩu không trùng khớp.");
      return true;
    } else {
      setErrorMatKhauLapLai("");
      return false;
    }
  };

  const handleMatKhauLapLaiChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Thay đổi giá trị
    setMatKhauLapLai(e.target.value);
    // Kiểm tra
    setErrorMatKhauLapLai("");
    // Kiểm tra sự tồn tại
    return kiemTraMatKhauLapLai(e.target.value);
  };

  const styleBoder = {
    marginTop : 30,
    padding :20,
    boxShadow : '0 0 4px grey',
    borderRadius : 20
  }
  const enterLoadingDangKi = (index: number) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 4000);
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="boders w-75" style={styleBoder}>
        <h1 className="mt-5 text-center">Đăng ký</h1>
        <div className="mb-3 col-md-6 col-12 mx-auto">
          <form onSubmit={handleSubmit} className="form">
            <div className="mb-3">
              <label
                style={{ textAlign: "left", display: "block" }}
                htmlFor="tenDangNhap"
                className="form-label"
              >
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="tenDangNhap"
                className="form-control"
                value={tenDangNhap}
                onChange={handleTenDangNhapChange}
              />
              <div style={{ color: "red", textAlign: "left" }}>
                {errorTenDangNhap}
              </div>
            </div>
            <div className="mb-3">
              <label
                style={{ textAlign: "left", display: "block" }}
                htmlFor="email"
                className="form-label"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                className="form-control"
                value={email}
                onChange={handleEmailChange}
              />
              <div style={{ color: "red", textAlign: "left" }}>
                {errorEmail}
              </div>
            </div>
            <div className="mb-3">
              <label
                style={{ textAlign: "left", display: "block" }}
                htmlFor="matKhau"
                className="form-label"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="matKhau"
                className="form-control"
                value={matKhau}
                onChange={handleMatKhauChange}
              />
              <div style={{ color: "red", textAlign: "left" }}>
                {errorMatKhau}
              </div>
            </div>
            <div className="mb-3">
              <label
                style={{ textAlign: "left", display: "block" }}
                htmlFor="matKhauLapLai"
                className="form-label"
              >
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                id="matKhauLapLai"
                className="form-control"
                value={matKhauLapLai}
                onChange={handleMatKhauLapLaiChange}
              />
              <div style={{ color: "red", textAlign: "left" }}>
                {errorMatKhauLapLai}
              </div>
            </div>
            <div className="mb-3">
              <label
                style={{ textAlign: "left", display: "block" }}
                htmlFor="hoDem"
                className="form-label"
              >
                Họ đệm
              </label>
              <input
                type="text"
                id="hoDem"
                className="form-control"
                value={hoDem}
                onChange={(e) => setHoDen(e.target.value)}
              />
              <div style={{ color: "red", textAlign: "left" }}>
                {errorHoDem}
              </div>
            </div>
            <div className="mb-3">
              <label
                style={{ textAlign: "left", display: "block" }}
                htmlFor="ten"
                className="form-label"
              >
                Tên
              </label>
              <input
                type="text"
                id="ten"
                className="form-control"
                value={ten}
                onChange={(e) => setTen(e.target.value)}
              />
              <div style={{ color: "red", textAlign: "left" }}>{errorTen}</div>
            </div>
            <div className="mb-3">
              <label
                style={{ textAlign: "left", display: "block" }}
                htmlFor="soDienThoai"
                className="form-label"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                id="soDienThoai"
                className="form-control"
                value={soDienThoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
              />
              <div style={{ color: "red", textAlign: "left" }}>
                {errorSoDienThoai}
              </div>
            </div>
            <div className="mb-3">
              <label
                style={{ textAlign: "left", display: "block" }}
                htmlFor="gioiTinh"
                className="form-label"
              >
                Giới tính
              </label>
              <input
                type="text"
                id="gioiTinh"
                className="form-control"
                value={gioiTinh}
                onChange={(e) => setGioiTinh(e.target.value)}
              />
              <div style={{ color: "red", textAlign: "left" }}>
                {errorGioiTinh}
              </div>
            </div>
            <div className="d-flex justify-content-center">
            <Flex gap="small" wrap="wrap">
            <AntButton
              style={{ width: 100, height: 40 , fontWeight:600 }}
              type="primary"
              htmlType="submit"
              loading={loadings[0]}
              onClick={() => enterLoadingDangKi(0)}
            >
              Đăng Kí
            </AntButton>
          </Flex>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DangKyNguoiDung;
