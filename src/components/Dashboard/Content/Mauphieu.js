import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, message, Modal, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddEditModal from '../../Modal/DanhMucLoaiMauPhieu/Add';
import axiosInstance from '../../../utils/axiosInstance';
import '../../../assets/css/Nguoidung.css';

const { Content } = Layout;
const { Search } = Input;

const columns = (onEdit, onDelete) => [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    align: 'center',
    render: (_, __, index) => index + 1,
  },
  {
    title: 'Tên loại mẫu phiếu',
    dataIndex: 'TenLoaiMauPhieu',
    key: 'TenLoaiMauPhieu',
    align: 'left',
  },
  {
    title: 'Thao tác',
    key: 'actions',
    align: 'center',
    render: (_, record) => (
      <span className="action-icons">
        <Button
          type="link"
          style={{ color: 'black', fontSize: '20px' }}
          onClick={() => onEdit(record)}
        >
          <EditOutlined />
        </Button>
        <Button
          type="link"
          style={{ color: 'black', fontSize: '20px' }}
          danger
          onClick={() => onDelete(record)} // Add delete action
        >
          <DeleteOutlined />
        </Button>
      </span>
    ),
  },
];

const contentStyle = {
  width: '100%',
  height: '800px',
  color: '#000',
  backgroundColor: '#fff',
  borderRadius: 1,
  border: '1px solid #ccc',
  padding: '20px',
  textAlign: 'center',
};

const Nguoidung = () => {
  const [searchName, setSearchName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dataSource, setDataSource] = useState([]); // Start with an empty array
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete modal
  

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/v1/DanhMucLoaiMauPhieu/DanhSachLoaiMauPhieu?pageNumber=1&pageSize=20`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Ensure the token is saved in localStorage
          },
        });

        if (response.data && response.data.status === 1 && response.data.data) {
          const formattedData = response.data.data.map((item, index) => ({
            key: item.LoaiMauPhieuID,
            stt: index + 1,
            TenLoaiMauPhieu: item.TenLoaiMauPhieu || '',
            MaLoaiMauPhieu: item.MaLoaiMauPhieu || '',
            TrangThai: item.TrangThai,
            GhiChu: item.GhiChu,
          }));
          setDataSource(formattedData);  // Update state
        } else {
          message.error('Không thể lấy dữ liệu hợp lệ từ máy chủ');
        }
      } catch (error) {
        message.error('Đã xảy ra lỗi khi lấy dữ liệu từ máy chủ');
      }
    };
    fetchData();
  }, []); 

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        // Use the current searchName to make a dynamic API call
        const response = await axiosInstance.get(`/v1/DanhMucLoaiMauPhieu/DanhSachLoaiMauPhieu?name=name=${searchName}&pageSize=20`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Ensure the token is saved in localStorage
          },
        });
        if (response.data && response.data.status === 1 && response.data.data) {
          const formattedData = response.data.data.map((item, index) => ({
            key: item.LoaiMauPhieuID,
            stt: index + 1,
            TenLoaiMauPhieu: item.TenLoaiMauPhieu || '',
            MaLoaiMauPhieu: item.MaLoaiMauPhieu || '',
            TrangThai: item.TrangThai,
            GhiChu: item.GhiChu,
          }));
          setDataSource(formattedData); // Update state
        } else {
          
        }
      } catch (error) {
        
      }
    };
  
    // Only run fetchSearch when searchName changes
    if (searchName) {
      fetchSearch();
    }
  }, [searchName]);

  const handleNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleOpenModal = (record = null) => {
    setSelectedRecord(record);
    setIsEditMode(!!record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (values) => {
    try {
      const dataToSend = {
        TenLoaiMauPhieu: values.TenLoaiMauPhieu,
        MaLoaiMauPhieu: values.MaLoaiMauPhieu,
        GhiChu: values.GhiChu,
      };
  
      let response;
      if (isEditMode) {
        // Gửi API cập nhật
        response = await axiosInstance.post(
          `/v1/DanhMucLoaiMauPhieu/CapNhapThongTinLoaiMauPhieu`,
          { ...dataToSend, LoaiMauPhieuID: selectedRecord.key },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
      } else {
        // Gửi API thêm mới
        response = await axiosInstance.post(
          `/v1/DanhMucLoaiMauPhieu/ThemMoiLoaiMauPhieu`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );
      }
  
      if (response.data.status === 1) {
        message.success(isEditMode ? 'Cập nhật thành công!' : 'Đã thêm thành công!');
  
        // Gọi lại API để lấy danh sách mới nhất
        const fetchData = async () => {
          try {
            const response = await axiosInstance.get(`/v1/DanhMucLoaiMauPhieu/DanhSachLoaiMauPhieu?pageNumber=1&pageSize=20`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              },
            });
  
            if (response.data && response.data.status === 1 && response.data.data) {
              const formattedData = response.data.data.map((item, index) => ({
                key: item.LoaiMauPhieuID,
                stt: index + 1,
                TenLoaiMauPhieu: item.TenLoaiMauPhieu || '',
                MaLoaiMauPhieu: item.MaLoaiMauPhieu || '',
                TrangThai: item.TrangThai,
                GhiChu: item.GhiChu,
              }));
              setDataSource(formattedData);
            } else {
              message.error('Không thể lấy dữ liệu hợp lệ từ máy chủ');
            }
          } catch (error) {
            message.error('Đã xảy ra lỗi khi lấy dữ liệu từ máy chủ');
          }
        };
  
        await fetchData(); // Cập nhật bảng với dữ liệu mới
        setIsModalOpen(false); // Đóng modal
      } else {
        message.error('Có lỗi xảy ra, vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      message.error('Đã xảy ra lỗi trong quá trình lưu.');
    }
  };
  

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Token for delete:', token); 
      if (!token) {
        message.error('Token không hợp lệ hoặc đã hết hạn.');
        return;
      }
      const response = await axiosInstance.post(
        `/v1/DanhMucLoaiMauPhieu/XoaThongTinLoaiMauPhieu`, 
        null,  
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: selectedRecord.key, 
          },
        }
      );
      if (response.data.status === 1) {
        message.success('Đã xóa thành công!');
        setDataSource(dataSource.filter(item => item.key !== selectedRecord.key));
      } else {
        message.error('Có lỗi xảy ra khi xóa!');
      }
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting data:', error);
      message.error('Lỗi khi gọi API, vui lòng thử lại!');
      setIsDeleteModalVisible(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const filteredData = dataSource.filter(item =>
    item?.TenLoaiMauPhieu?.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <Content style={contentStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        
        <h1 style={{ fontSize: 19,marginLeft: 15 }}>DANH MỤC LOẠI MẪU PHIẾU</h1>
        
        <Button type="primary" onClick={() => handleOpenModal()}>Thêm mới</Button>
      </div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <DatePicker onChange={(date, dateString) => console.log(date, dateString)} picker="year" />
          <Search
            placeholder="Tìm kiếm theo tên"
            allowClear
            value={searchName}
            onSearch={() => setSearchName('')}
            onChange={handleNameChange}
            style={{
              width: 200,
            }}
          />
        </div>
      <Table
        className="custom-table"
        columns={columns(handleOpenModal, handleDelete)}
        dataSource={filteredData}
        pagination={{
          pageSize: 5,  
          onChange: (page, pageSize) => {
            console.log('Page:', page, 'PageSize:', pageSize); 
          },
        }}
        rowClassName="editable-row"
      />
      <AddEditModal
        isVisible={isModalOpen}
        modalMode={isEditMode ? 'edit' : 'add'}
        initialValues={selectedRecord}
        onCancel={handleCloseModal}
        onFinish={handleSave}
      />
      <Modal
        title="Xóa loại mẫu phiếu"
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Có"
        cancelText="Không"
      >
        <p>Bạn có chắc chắn muốn xóa loại mẫu phiếu này?</p>
      </Modal>
    </Content>
  );
};

export default Nguoidung;
