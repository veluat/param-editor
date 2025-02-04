import React from 'react'

interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

// Пропсы для компонента ParamEditor
interface Props {
  params: Param[];
  model: Model;
}

// Состояние редактора
interface State {
  paramValues: { [key: number]: string };
}

// Компонент ParamEditor
class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const initialValues: { [key: number]: string } = {}
    props.model.paramValues.forEach(paramValue => {
      initialValues[paramValue.paramId] = paramValue.value
    })
    this.state = {
      paramValues: initialValues,
    }
  }

  // Метод для получения полной структуры модели
  public getModel(): Model {
    const paramValues = Object.keys(this.state.paramValues).map(key => ({
      paramId: Number(key),
      value: this.state.paramValues[Number(key)],
    }))
    return {
      paramValues,
    }
  }

  // Метод для обработки изменений в полях ввода
  private handleChange = (paramId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      paramValues: {
        ...this.state.paramValues,
        [paramId]: event.target.value,
      },
    })
  }

  render() {
    return (
      <div className='param-editor'>
        {this.props.params.map(param => (
          <div key={param.id} className='param-input'>
            <label className='param-label'>
              {param.name}
            </label>
            <input
              type='text'
              value={this.state.paramValues[param.id] || ''}
              onChange={this.handleChange(param.id)}
              className='param-field'
            />
          </div>
        ))}
      </div>
    )
  }
}

// Пример использования компонента
const params: Param[] = [
  {id: 1, name: 'Назначение', type: 'string'},
  {id: 2, name: 'Длина', type: 'string'}
]

const model: Model = {
  paramValues: [
    {paramId: 1, value: 'повседневное'},
    {paramId: 2, value: 'макси'}
  ]
}

// Основной компонент приложения
const App: React.FC = () => {
  const editorRef = React.useRef<ParamEditor>(null)
  const [modelData, setModelData] = React.useState<Model | null>(null)

  const handleGetModel = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel()
      setModelData(model)
    }
  }

  return (
    <div id='root'>
      <h1 className='app-title'>Редактор параметров товара</h1>
      <ParamEditor params={params} model={model} ref={editorRef}/>
      <button onClick={handleGetModel} className='get-model-button'>
        Получить модель
      </button>
      {modelData && (
        <pre className='model-output'>
          {JSON.stringify(modelData, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default App