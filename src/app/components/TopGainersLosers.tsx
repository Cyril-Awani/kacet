'use client';
import React, { useState, useEffect } from 'react';

const TopGainersTable = () => {
	const [topCoins, setTopCoins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch data for top gainers
	const fetchTopGainers = async () => {
		try {
			const response = await fetch(
				`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=true`,
			);
			const data = await response.json();

			// Process data to get relevant fields for the table
			const coins = data.map((coin) => ({
				symbol: coin.symbol.toUpperCase(),
				name: coin.name,
				price: coin.current_price.toFixed(2),
				change_1h:
					coin.price_change_percentage_1h_in_currency?.toFixed(1) || 'N/A',
				change_24h: coin.price_change_percentage_24h.toFixed(1),
				change_7d:
					coin.price_change_percentage_7d_in_currency?.toFixed(1) || 'N/A',
				volume: coin.total_volume.toLocaleString(),
				marketCap: coin.market_cap.toLocaleString(),
				sparkline: coin.sparkline_in_7d.price, // 7-day price chart data
			}));

			setTopCoins(coins);
		} catch (error) {
			console.error('Error fetching data:', error);
			setError('Failed to fetch data');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTopGainers();
	}, []);

	if (loading) return <p>Loading data...</p>;
	if (error) return <p>{error}</p>;

	return (
		<section className='py-10'>
			<h2 className='text-3xl font-bold mb-5'>🚀 Largest Gainers</h2>
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white border border-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-4 py-2 border'>#</th>
							<th className='px-4 py-2 border'>Coin</th>
							<th className='px-4 py-2 border'>Price</th>
							<th className='px-4 py-2 border'>1h</th>
							<th className='px-4 py-2 border'>24h</th>
							<th className='px-4 py-2 border'>7d</th>
							<th className='px-4 py-2 border'>24h Volume</th>
							<th className='px-4 py-2 border'>Market Cap</th>
							<th className='px-4 py-2 border'>Last 7 Days</th>
						</tr>
					</thead>
					<tbody>
						{topCoins.map((coin, index) => (
							<tr key={index} className='text-center'>
								<td className='px-4 py-2 border'>{index + 1}</td>
								<td className='px-4 py-2 border'>
									{coin.name} ({coin.symbol})
								</td>
								<td className='px-4 py-2 border'>${coin.price}</td>
								<td
									className={`px-4 py-2 border ${
										coin.change_1h >= 0 ? 'text-green-500' : 'text-red-500'
									}`}>
									{coin.change_1h}%
								</td>
								<td
									className={`px-4 py-2 border ${
										coin.change_24h >= 0 ? 'text-green-500' : 'text-red-500'
									}`}>
									{coin.change_24h}%
								</td>
								<td
									className={`px-4 py-2 border ${
										coin.change_7d >= 0 ? 'text-green-500' : 'text-red-500'
									}`}>
									{coin.change_7d}%
								</td>
								<td className='px-4 py-2 border'>${coin.volume}</td>
								<td className='px-4 py-2 border'>${coin.marketCap}</td>
								<td className='px-4 py-2 border'>
									{/* Display 7-day chart with sparkline */}
									<div className='w-24 h-8 bg-gray-100'>
										{/* Display sparkline or 7-day chart */}
										{/* You can use an SVG or a small chart library to render sparkline */}
										<svg width='100%' height='100%'>
											<polyline
												fill='none'
												stroke='#4CAF50'
												strokeWidth='2'
												points={coin.sparkline
													.map(
														(price, i) =>
															`${i * 2},${
																100 -
																(price / Math.max(...coin.sparkline)) * 100
															}`,
													)
													.join(' ')}
											/>
										</svg>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default TopGainersTable;
