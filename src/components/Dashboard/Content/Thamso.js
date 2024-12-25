import React, { useState } from 'react';
import { Button, Layout, Table, Input, Select } from 'antd';
import '../../../assets/css/Nguoidung.css'; // File CSS cho bảng

const { Content } = Layout;
const { Option } = Select;
const { Search } = Input; // Add this to import Search

const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    align: 'center',
  },
  {
    title: 'Tham số	',
    dataIndex: 'hoTen',
    key: 'hoTen',
    align: 'left',
  },
  {
    title: 'Giá trị',
    dataIndex: 'hoTen',
    key: 'hoTen',
    align: 'left',
  },
  {
    title: 'Ghi chú	',
    dataIndex: 'tenTaiKhoan',
    key: 'tenTaiKhoan',
    align: 'left',
  },
  {
    title: 'Trạng thái sử dụng',
    dataIndex: 'tenTaiKhoan',
    key: 'tenTaiKhoan',
    align: 'left',
  },
  {
    title: 'Thao tác',
    dataIndex: 'tenTaiKhoan',
    key: 'tenTaiKhoan',
    align: 'left',
  },
];

const dataSource = [
  {
    key: '1',
    stt: '1',
    hoTen: 'Nguyễn Văn A',
    tenTaiKhoan: 'nguyenvana',
    ngaySinh: '2000-01-01',
    gioiTinh: 'Nam',
    diaChi: '123 Đường ABC, TP.HCM',
    coQuan: 'Công ty XYZ',
  },
  {
    key: '2',
    stt: '2',
    hoTen: 'Trần Thị B',
    tenTaiKhoan: 'tranthib',
    ngaySinh: '1995-05-12',
    gioiTinh: 'Nữ',
    diaChi: '456 Đường DEF, Hà Nội',
    coQuan: 'Tập đoàn ABC',
  },
];

const contentStyle = {
  width: '100%',
  height: '100%',
  color: '#000',
  backgroundColor: '#fff',
  borderRadius: 1,
  border: '1px solid #ccc',
  padding: '20px',
};

const Nguoidung = () => {
  const [searchName, setSearchName] = useState('');
  const [searchGender, setSearchGender] = useState('');

  const handleNameChange = (e) => setSearchName(e.target.value);
  const handleGenderChange = (value) => setSearchGender(value);

  const onSearch = (value) => {
    setSearchName(value); // This will handle the search input
  };

  const filteredData = dataSource.filter(item => {
    return (
      item.hoTen.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchGender ? item.gioiTinh === searchGender : true)
    );
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={contentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: 19 }}>
          QUẢN LÝ  THAM SỐ HỆ THỐNG 
          </h1>
          <Button type="primary">Thêm</Button>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Select
      allowClear
      placeholder="Chọn trạng thái"
      value={searchGender}
      onChange={handleGenderChange}
      style={{ width: '200px' }}
    >
      <Option value="Đang sử dụng">Đang sử dụng</Option>
      <Option value="Không sử dụng">Không sử dụng</Option>
    </Select>
          <Search
            placeholder="Tìm kiếm theo tên"
            value={searchName}
            onSearch={onSearch}
            onChange={handleNameChange}
            style={{
              width: 200,
            }}
          />
        </div>

        <Table
          className="custom-table"
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
        />
      </Content>
    </Layout>
  );
};

export default Nguoidung;