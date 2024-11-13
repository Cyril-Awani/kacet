'use client';
import React, { useState, useEffect } from 'react';

type ForexDataItem = {
	pair: string;
	price: number;
	timestamp: string;
};

const ForexTable = () => {
	const [forexData, setForexData] = useState<ForexDataItem[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch data for specific Forex pairs
	const fetchForexData = async () => {
		try {
			const forexPairs = ['EURUSD', 'GBPJPY', 'USDJPY', 'AUDUSD', 'EURGBP'];
			const apiKey = '8fab193f78a5425ae6f66e1d'; // Your ExchangeRate-API key
			const response = await Promise.all(
				forexPairs.map((pair) =>
					fetch(
						`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${pair.slice(
							0,
							3,
						)}`,
					)
						.then((res) => res.json())
						.then((data) => ({
							pair: pair,
							price: data.conversion_rates[pair.slice(3)],
							timestamp: data.time_last_update_utc,
						})),
				),
			);

			setForexData(response);
		} catch (error) {
			console.error('Error fetching data:', error);
			setError('Failed to fetch data');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchForexData();
	}, []);

	if (loading) return <p>Loading data...</p>;
	if (error) return <p>{error}</p>;

	return (
		<section className='py-10'>
			<h2 className='text-2xl text-gray-900 font-bold mb-5 text-center'>
				💱 Major Forex Pairs{' '}
				<span className='text-sm font-thin'> Updates Every 24h</span>
			</h2>
			<div className='overflow-x-auto flex justify-center'>
				<div className='max-w-7xl w-full'>
					<table className='min-w-full bg-white border border-gray-200'>
						<thead className='bg-gray-100'>
							<tr>
								<th className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
									Forex Pair
								</th>
								<th className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
									Price
								</th>
								<th className='px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
									Last Updated
								</th>
							</tr>
						</thead>
						<tbody className='text-gray-700'>
							{forexData.map((data, index) => (
								<tr key={index} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{data.pair}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600'>
										${data.price.toFixed(4)}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{new Date(data.timestamp).toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
};

export default ForexTable;
