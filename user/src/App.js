import {useEffect, useState, useCallback} from 'react';

function App() {
	let [statistic, setStatistic] = useState({
		userName: "user XXX",
		lastMessage: {
			message: 'ZZZ',
			userName: "user YYY",
			date: Date.now()
		}
	});
	
	//let prefix = 'http://localhost:3003';
	let prefix = '';
	
	useEffect(() => {
		fetch(prefix+'/api/main', {
			method: 'GET',
			mode: 'cors',
			//credentials: 'include'
		}).then((res) => {
			if(res.status === 403) {
				window.location.href = prefix+'/';
			} else {
				return res.json().then((res) => {
					setStatistic(res);
				})
			}
		});
	}, []);
	
	useEffect(() => {
		let timer = setInterval(() => {
			fetch(prefix+'/api/main', {
				method: 'GET',
				mode: 'cors',
				//credentials: 'include'
			}).then((res) => {
				if(res.status === 403) {
					window.location.href = prefix+'/';
				} else {
					return res.json().then((res) => {
						setStatistic(res);
					})
				}
			});
		}, 4500);
		return () =>{
			clearInterval(timer);
		}
	}, []);
	
	const logout = useCallback(() => {
		fetch(prefix+'/api/logout', {
			method: 'POST',
			mode: 'cors',
			//credentials: 'include'
			body: JSON.stringify({}),
			headers: {'Content-Type': 'application/json'},
		}).then((res) => {
			if(res.status === 200) {
				window.location.href = prefix+'/';
			}
		});
	}, []);
	
	const sendSis = useCallback(() => {
		fetch(prefix+'/api/send-message', {
			method: 'POST',
			mode: 'cors',
			//credentials: 'include'
			body: JSON.stringify({message: 'Sis!'}),
			headers: {'Content-Type': 'application/json'},
		}).then((res) => {
			if(res.status === 403) {
				window.location.href = prefix+'/';
			} else {
				return res.json().then((res) => {
					setStatistic(res);
				})
			}
		});
	}, []);
	
	const sendBro = useCallback(() => {
		fetch(prefix+'/api/send-message', {
			method: 'POST',
			mode: 'cors',
			//credentials: 'include'
			body: JSON.stringify({message: 'Bro!'}),
			headers: {'Content-Type': 'application/json'},
		}).then((res) => {
			if(res.status === 403) {
				window.location.href = prefix+'/';
			} else {
				return res.json().then((res) => {
					setStatistic(res);
				})
			}
		});
	}, []);
	
	return (
		<div className="container-fuid">
			<div className="p-3 row justify-content-center">
				<div className="row col-sm-6 justify-content-center align-items-center">
					<div className="col-sm-auto">Hello: </div>
					<div className="col-sm-auto"><strong>{statistic.userName}</strong></div>
				</div>
				<div className="col-sm-auto"><a className="btn btn-danger btn-sm" onClick={logout} href="#">Logout</a></div>
			</div>
			<div className="p-3 row justify-content-center">
				<div className="row col-sm-auto">
					<div className="row">
						<div className="col-sm-auto"><small><em>Message: </em></small></div>
						<div className="col-sm-auto"><small><em><strong>{statistic.lastMessage.message}</strong></em></small></div>
					</div>
					<div className="row">
						<div className="col-sm-auto"><small><em>Send by</em></small></div>
						<div className="col-sm-auto"><small><em><strong>{statistic.lastMessage.userName}</strong></em></small></div>
						<div className="col-sm-auto"><small><em>{new Date(statistic.lastMessage.date).toLocaleString('ua-UA')}</em></small></div>
					</div>
				</div>
			</div>
			<div className="p-1 row justify-content-center">
				<div className="col-sm-auto"><a className="btn btn-success btn-lg" onClick={sendSis} href="#">Sis!</a></div>
				<div className="col-sm-auto"><a className="btn btn-warning btn-lg" onClick={sendBro} href="#">Bro!</a></div>
			</div>
		</div>
	);
}

export default App;
