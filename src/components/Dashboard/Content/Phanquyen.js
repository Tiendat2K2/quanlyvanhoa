import React, { useState, useEffect } from 'react';
import { Button, Layout, Table, Input, message, Popconfirm, Modal, Form } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import axiosInstance from '../../../utils/axiosInstance';
import '../../../assets/css/Nguoidung.css';
const { Content } = Layout;
const { Search } = Input;
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
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState(null);
  const [showSettings, setShowSettings] = useState(false); // State to manage settings visibility

  // Fetch data from API
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/SysGroups/GroupsList', {
        params: { pageNumber: 1, pageSize: 20 },
      });
      if (response.data.Status === 1) {
        const formattedData = response.data.Data.map((item, index) => ({
          key: item.GroupID,
          stt: index + 1,
          hoTen: item.GroupName,
          tenTaiKhoan: item.Description,
        }));
        setDataSource(formattedData);
      } else {
        message.error('Failed to fetch group data.');
      }
    } catch (error) {
      message.error('Error while fetching data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);
  
  // Open modal for adding or editing
  const showModal = (record = null) => {
    setEditRecord(record);
    form.resetFields();
    if (record) {
      form.setFieldsValue({ GroupName: record.hoTen, Description: record.tenTaiKhoan });
    }
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditRecord(null);
  };

  // Add or Edit Group
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editRecord) {
        // Update group
        await axiosInstance.post('/SysGroups/UpdatingGroup', {
          GroupID: editRecord.key,
          GroupName: values.GroupName,
          Description: values.Description,
        });
        message.success('Group updated successfully.');
      } else {
        // Add group
        await axiosInstance.post('/SysGroups/CreatingGroup', {
          GroupID: 0,
          GroupName: values.GroupName,
          Description: values.Description,
        });
        message.success('Group added successfully.');
      }
      fetchGroups(); // Refresh data
      handleCancel(); // Close modal
    } catch (error) {
      message.error('Error while saving the group.');
      console.error(error);
    }
  };

  // Delete a group
  const handleDelete = async (groupId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/SysGroups/DeleteGroup?groupId=${groupId}`);
      if (response.data.Status === 1) {
        message.success('Group deleted successfully.');
        fetchGroups(); // Refresh data
      } else {
        message.error(`Failed to delete the group: ${response.data.Message}`);
      }
    } catch (error) {
      message.error('Error while deleting the group.');
      console.error('Delete error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e) => setSearchName(e.target.value);
  const onSearch = (value) => setSearchName(value);

  const filteredData = dataSource.filter((item) =>
    item.hoTen.toLowerCase().includes(searchName.toLowerCase())
  );

  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt', align: 'center' },
    { title: 'Tên nhóm người dùng', dataIndex: 'hoTen', key: 'hoTen', align: 'left' },
    { title: 'Ghi chú', dataIndex: 'tenTaiKhoan', key: 'tenTaiKhoan', align: 'left' },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => setShowSettings(true)} // Open settings
           style={{ color: "black", fontSize: "20px" }}> 
            <SettingOutlined />
          </Button>
          <Button type="link" onClick={() => showModal(record)}
             style={{ color: "black", fontSize: "20px" }}>
        <EditOutlined />
      </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhóm này không?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger
             style={{ color: "black", fontSize: "20px" }}>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={contentStyle}>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}
        >
          <h1 style={{ fontSize: 19 }}>QUẢN LÝ PHÂN QUYỀN NGƯỜI DÙNG</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Thêm
          </Button>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <Search
            placeholder="Tìm kiếm theo tên"
            value={searchName}
            onSearch={onSearch}
            onChange={handleNameChange}
            style={{ width: 200 }}
          />
        </div>

        {showSettings && (
          <div style={{ marginBottom: '20px', width: '100%', height: '100%', color: '#000', backgroundColor: '#fff', borderRadius: 1, border: '1px solid #ccc', padding: '20px', position: 'relative' }} >
            {/* Additional content to display when settings are visible */}
            <Button type="link" onClick={() => setShowSettings(false)} // Close settings
             style={{ color: "black", fontSize: "20px", position: 'absolute', top: '20px', right: '20px' }}>
              <CloseOutlined />
            </Button>
            <div>
              <h1 style={{ fontSize: 19 }}>QUẢN LÝ PHÂN QUYỀN NGƯỜI DÙNG</h1>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                Thêm
              </Button>
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
              <Search
                placeholder="Tìm kiếm theo tên"
                value={searchName}
                onSearch={onSearch}
                onChange={handleNameChange}
                style={{ width: 200 }}
              />
            </div>
          </div>
        )}

        <Table
          className="custom-table"
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
          loading={loading}
        />
        <Modal
          title={editRecord ? 'Chỉnh sửa nhóm' : 'Thêm nhóm'}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="GroupName"
              label="Tên nhóm"
              rules={[{ required: true, message: 'Vui lòng nhập tên nhóm!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="Description"
              label="Ghi chú"
              rules={[{ required: true, message: 'Vui lòng nhập ghi chú!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};
export default Nguoidung;