import {useEffect, useState} from 'react';

function App() {
	let [statistic, setStatistic] = useState({"Sis!": "Y", "Bro!": "X"});
	
	useEffect(() => {
		fetch('/public-api/main', {
			method: 'GET',
			mode: 'cors',
			//credentials: 'include'
		}).then((res) => res.json()).then((res) => {
			setStatistic(res);
		});
	}, []);
	
	return (
		<div className="container-fuid">
			<div className="p-3 container-sm">
				<div className="text-center">
					<h4>Authentication</h4>
				</div>
				<div className="row justify-content-center">
					<div className="col-sm-auto">
						<a className="btn btn-outline-primary btn-lg" href="/auth/facebook">facebook</a>
					</div>
					<div className="col-sm-auto">
						<a className="btn btn-outline-primary btn-lg" href="/auth/google">google</a>
					</div>
					<div className="col-sm-auto">
						<a className="btn btn-outline-primary btn-lg" href="/auth/github">github</a>
					</div>
				</div>
			</div>
			<div className="p-1 row justify-content-center">
				<div className="col-sm-auto">statistic: </div>
				<div className="row col-sm-auto">
					<div className="row col-sm-auto">
						<div className="col-sm-auto"><strong>Sis!</strong></div><div className="col-sm-auto">{statistic["Sis!"]}</div>
					</div>
					<div className="row col-sm-auto">
						<div className="col-sm-auto"><strong>Bro!</strong></div><div className="col-sm-auto">{statistic["Bro!"]}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
