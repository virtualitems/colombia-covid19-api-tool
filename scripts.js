(async () => {
	const container = document.getElementById('param-table-body')

	const apiUrl = new URL('https://datosabiertos.bogota.gov.co/api/3/action/datastore_search?')

	const apiResourceCodes = 'https://datosabiertos.bogota.gov.co/api/3/action/datastore_search?resource_id=_table_metadata'

	const urlField = document.getElementById('url-field')

	const copyBtn = document.getElementById('copy-button')

	const resourceIdDoc = {key: 'resource_id', type: 'string', defaultValue: '', description: 'Código del recurso que se desea consultar'}

	const docs = [
		{key: 'distinct',
			type: 'boolean',
			defaultValue: 'true',
			description: 'Obtener sólo registros distintos',
			example: 'true'},
		{key: 'fields',
			type: 'string',
			defaultValue: '',
			description: 'Especificar los campos a obtener',
			example: ''},
		{key: 'filters',
			type: 'string',
			defaultValue: '',
			description: 'Condiciones de búsqueda',
			example: '{"key1": "a", "key2": "b"}'},
		{key: 'include_total',
			type: 'boolean',
			defaultValue: 'true',
			description: 'Obtener el número de registros',
			example: 'true'},
		{key: 'language',
			type: 'string',
			defaultValue: 'english',
			description: 'Especificar el lengaje de la consulta',
			example: 'english'},
		{key: 'limit',
			type: 'integer',
			defaultValue: '100',
			description: 'Número máximo de registros que se desea obtener',
			example: '100'},
		{key: 'offset',
			type: 'integer',
			defaultValue: '',
			description: '<<Offset this number of rows>>',
			example: ''},
		{key: 'plain',
			type: 'boolean',
			defaultValue: 'true',
			description: 'Especificar si se desea hacer la consulta en texto plano',
			example: 'true'},
		{key: 'q',
			type: 'string',
			defaultValue: '',
			description: 'Buscar el texto dado en todas las filas o especificar pares de clave y valor para buscar en campos específicos',
			example: 'text | {"key": "value"}'},
		{key: 'records_format',
			type: 'string',
			defaultValue: 'objects',
			description: 'Especificar el formato en que se desea obtener los datos',
			example: 'objects | lists | csv | tsv'},
		{key: 'sort',
			type: 'string',
			defaultValue: '',
			description: 'comma separated field names with ordering',
			example: 'field, field2 desc'},
	]

	const resourceList = [
		{label: 'infectados Covid19', name: 'b64ba3c4-9e41-41b8-b3fd-2da21d627558'}
	]

	const createTableRow = ({key, type, defaultValue, description, example}, isResource) => {

		// V A L I D A T E
		key = typeof key === "string" ? key : ''
		type = typeof type === "string" ? type : ''
		defaultValue = typeof defaultValue === "string" ? defaultValue : ''
		description = typeof description === "string" ? description : ''
		example = typeof example === "string" ? example : ''
		
		// D E C L A R E
		let row, opt, checkField, keyField, valueField, typeField, defaultField, descriptionField

		// C H E C K
		checkField = document.createElement('input')
		checkField.type = 'checkbox'

		// K E Y
		keyField = document.createElement('td')
		keyField.innerText = key

		// V A L U E
		if (isResource) {
			valueField = createSourceSelect(resourceList)
			valueField.value = valueField[0].value
		} else {
			valueField = document.createElement('input')
			valueField.type = 'text'
			valueField.value = defaultValue
			valueField.placeholder = example
		}

		// T Y P E
		typeField = document.createElement('td')
		typeField.innerText = type

		// D E F A U L T
		defaultField = document.createElement('td')
		defaultField.innerText = defaultValue

		// D E S C R I P T I O N
		descriptionField = document.createElement('td')
		descriptionField.innerText = description
		
		if (isResource) {
			checkField.checked = true
			checkField.disabled = true
			checkField.addEventListener('change', handleResourceChange)
			valueField.addEventListener('change', handleResourceChange)
		} else {
			checkField.addEventListener('change', handleInputsChange)
			valueField.addEventListener('change', handleInputsChange)
		}

		row = document.createElement('tr')
		row.dataset.key = key
		row.appendChild(document.createElement('td').appendChild(checkField).parentElement)
		row.appendChild(keyField)
		row.appendChild(document.createElement('td').appendChild(valueField).parentElement)
		row.appendChild(typeField)
		row.appendChild(defaultField)
		row.appendChild(descriptionField)	

		return row
	}

	const createSourceSelect = optionList => {
		const select = document.createElement('select')
		
		if (!optionList ) {
			select.disabled = true
			return select
		}

		let opt
		for (const iterator of optionList) {
			opt = document.createElement('option')
			opt.value = iterator.name
			opt.innerText = iterator.label
			select.appendChild(opt)
		}

		return  select
	}

	// error here
	const getResourceCodes = async () => {
		const reqHead = new Headers()
		const reqBody = { method: 'GET', headers: reqHead, mode: 'cors', cache: 'default' }
		const res = await fetch(apiResourceCodes, reqBody)
		const data = await res.json()
		console.log(data)
	}

	const fillTableBody = () => {
		let row = createTableRow(resourceIdDoc, true)
		container.appendChild(row)

		for(const param of docs) {
			row = createTableRow(param)
			container.appendChild(row)
		}
	}

	const handleCopyBtnClick = e => {
		urlField.select()
		document.execCommand('copy')
	}

	const handleResourceChange = e => {
		let row = e.target.parentElement.parentElement
		let key = row.dataset.key
		let value = row.querySelector('select').value.trim() || 'none'
		apiUrl.searchParams.set(key, value)
		urlField.value = apiUrl.toString()
	}

	const handleInputsChange = e => {
		let row = e.target.parentElement.parentElement
		let key = row.dataset.key
		let checked = row.querySelector('input[type=checkbox]').checked
		let value = row.querySelector('input[type=text]').value.trim()

		if (checked && value) {
			apiUrl.searchParams.set(key, value)
		} else {
			apiUrl.searchParams.delete(key)
		}

		urlField.value = apiUrl.toString()
	}

	// A U T O E X E C U T E
	fillTableBody()
	apiUrl.searchParams.append('resource_id', document.querySelector('select').value)
	urlField.value = apiUrl.toString()
	copyBtn.addEventListener('click', handleCopyBtnClick)

})()