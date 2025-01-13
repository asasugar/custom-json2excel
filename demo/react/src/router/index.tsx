import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AntdLayout } from './antd-layout';

import logo from '../assets/logo.png';
import { getRoutes } from './extra-routes';

export const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <AntdLayout />,
			children: [
				{
					path: '1',
					element: (
						<div>
							<img src={logo} width={200} />
						</div>
					)
				},
				...getRoutes()
			]
		}
	],
	{
		basename: '/'
	}
);
