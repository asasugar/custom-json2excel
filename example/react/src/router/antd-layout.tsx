import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Modal, Breadcrumb, Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Json2excel from '@asasugar-use/custom-json2excel';
import logo from '../assets/logo.png';

const { Header, Content, Sider } = Layout;
const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
	key,
	label: `nav ${key}`
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
	(icon, index) => {
		const key = String(index + 1);

		return {
			key: `sub${key}`,
			icon: React.createElement(icon),
			label: `subnav ${key}`,

			children: new Array(4).fill(null).map((_, j) => {
				const subKey = index * 4 + j + 1;
				return {
					key: subKey,
					label: `option${subKey}`
				};
			})
		};
	}
);




const handleExport = () => {
	const data = [
		{
			name: '哈哈',
			age: 1,
			sex: '男',
			companyName: '公司1',
			companyAddress: '公司地址1',
		},
		{
			name: '呵呵',
			age: 2,
			sex: '女',
			companyName: '公司2',
			companyAddress: '公司地址2',
		},
		{
			name: '嘻嘻',
			age: 3,
			sex: '男',
			companyName: '公司3',
			companyAddress: '公司地址3',
		},
		{
			name: '啦啦',
			age: 4,
			sex: '女',
			companyName: '公司4',
			companyAddress: '公司地址4',
		},
	];
	const json2excel = new Json2excel({ data });
	json2excel.generate();
};

export const AntdLayout: React.FC = () => {
	const {
		token: { colorBgContainer }
	} = theme.useToken();
	const navigate = useNavigate();
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


	return (
		<Layout>
			<Header className='header'>
				<div className='logo' />
				<Menu
					theme='dark'
					mode='horizontal'
					defaultSelectedKeys={['2']}
					items={items1}
					onClick={({ key }) => navigate(`/${key}`)}
				/>
			</Header>
			<Layout>
				<Sider width={200} style={{ background: colorBgContainer }}>
					<Menu
						mode='inline'
						defaultSelectedKeys={['1']}
						defaultOpenKeys={['sub1']}
						style={{ height: '100%', borderRight: 0 }}
						items={items2}
					/>
				</Sider>
				<Layout style={{ padding: '0 24px 24px' }}>
					<Breadcrumb style={{ margin: '16px 0' }}>
						<Breadcrumb.Item>Home</Breadcrumb.Item>
						<Breadcrumb.Item>List</Breadcrumb.Item>
						<Breadcrumb.Item>App</Breadcrumb.Item>
					</Breadcrumb>
					<Content
						style={{
							padding: 24,
							margin: 0,
							minHeight: 280,
							background: colorBgContainer
						}}
					>
						<Button type='primary' onClick={handleExport}>
							导出excel
						</Button>
						<div>
							<img width={600} src={logo} />
						</div>
						<Button type='primary' onClick={showModal}>
							Open Modal
						</Button>

						<Modal title='Basic Modal' open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
							<p>Some contents...</p>
							<p>Some contents...</p>
							<p>Some contents...</p>
						</Modal>
						<Outlet />
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};
