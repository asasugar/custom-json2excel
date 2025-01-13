import { ConfigProvider } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import type { Container } from 'react-dom/client';
import App from './app';
import './styles/reset.css';

const container = document.querySelector('#root');
const root = createRoot(container as Container);


root.render(
	<div>
		<ConfigProvider>
			<App />
		</ConfigProvider>
	</div>
);
