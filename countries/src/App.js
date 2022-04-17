import { useState, useEffect } from 'react'
import axios from 'axios'

const FilteredCountries = ({countries, filterValue}) => {
	const filtered = countries.filter(country => country.name.common.toLowerCase().includes(filterValue))
	if (filtered.length > 10){
		return (
			<div>
				<p>too many countries to display, please specify another filter value</p>
			</div>
		)
	}
	else if (filtered.length === 1){
		const country = filtered[0]
		return (
			<>
				<h2>{country.name.common}</h2>
				<p>capital {country.capital[0]}</p>
				<p>area {country.area}</p>
				<h3>Languages:</h3>
				<ul>
					{console.log(country)}
					{Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
				</ul>
				<img src={country.flags.png}></img>
			</>
		)
	}

	return (
		<ul>
			{filtered.map(country => <li key={country.name.common}>{country.name.common}</li>)}
		</ul>
	)
}

const App = () => {
	const [countries, setCountries] = useState([])
	const [filterValue, setFilterValue] = useState('')


	useEffect(() => {
		axios
			.get('https://restcountries.com/v3.1/all')
			.then(response => setCountries(response.data))
	}, [])

	const handleFilterChange = (event) => {
		setFilterValue(event.target.value)
	}

  return (
    <div>
		<form>
			<div>
				find countries <input value={filterValue}
				onChange={handleFilterChange}/>
			</div>
		</form>
		<div>
			{/* <ul>

			 <div>DEBUG: filterValue: {filterValue}</div>
			{countries
				.filter(country => country.name.common.toLowerCase().includes(filterValue))
				.map(country => <li key={country.name.common}>{country.name.common}</li>)}
			</ul> */}
			<FilteredCountries countries={countries} filterValue={filterValue}/>
		</div>
	</div>
  );
}

export default App;
