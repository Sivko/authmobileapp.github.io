import axios from "axios";
import { useEffect, useState } from "react";


function App() {

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userid, setUserid] = useState('');
  const [user, setUser] = useState({});

  const [tokenFieldId, setTokenFieldId] = useState('')
  const [passwordFieldId, setPasswordFieldId] = useState('')
  const [save, setSave] = useState("Сохранить")
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/vnd.api+json' } };

  const submit = (e) => {
    e.preventDefault();
    setSave("Сохранение")
    const data = {
      data: {
        id: userid,
        type: "users",
        attributes: {
          customs: {}
        }
      }
    }
    data.data.attributes.customs[`custom-${passwordFieldId}`] = password;
    data.data.attributes.customs[`custom-${tokenFieldId}`] = token;
    axios.patch(`https://app.salesap.ru/api/v1/users/${userid}`, data, config).then(() => { setSave("Успешно"); setTimeout(() => { setSave("Сохранить") }, 1000) });
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    let obj = {}
    url.searchParams.forEach((value, name) => {
      obj[name] = value
    })
    obj.origin = window.location.origin
    console.log(obj);
    if (!obj.token) {
      obj.token = 'oPWkfMf8iBbIJz0bY59hisy2Pp3sJYpFbLCAfid2KO0';
    }
    setToken(obj.token);
  }, []);

  useEffect(() => {
    async function fetching() {
      const currentToken = await axios.get('https://app.salesap.ru/api/v1/current-token', config)
      const _userId = currentToken.data.data.attributes["user-id"];
      setUserid(_userId)
      const getFieldMobileApp_token = await axios.get('https://app.salesap.ru/api/v1/custom-fields?filter[resources]=users&filter[q]=tokenMobileApp', config)
      const _tokenFieldId = getFieldMobileApp_token.data.data[0]?.id
      if (_tokenFieldId) {
        setTokenFieldId(_tokenFieldId)
      } else {
        const getGategoryFields = await axios.get('https://app.salesap.ru/api/v1/custom-field-categories?filter[class-name]=User', config);
        const categoryId = await getGategoryFields.data.data[0].id
        const dataFieldToken = {
          "data": {
            "type": "custom-fields",
            "attributes": {
              "required": false,
              "resource-name": "users",
              "field-type": "text",
              "name": "tokenMobileApp"
            },
            "relationships": {
              "custom-field-category": {
                "data": {
                  "type": "custom-field-categories",
                  "id": categoryId
                }
              }
            }
          }
        }
        const setFieldMobileApp_token = await axios.post('https://app.salesap.ru/api/v1/custom-fields', dataFieldToken, config)
        setTokenFieldId(setFieldMobileApp_token.data.data.id);
      }
      const getFieldMobileApp_password = await axios.get('https://app.salesap.ru/api/v1/custom-fields?filter[resources]=users&filter[q]=passwordMobileApp', config)
      const _passwordFieldId = getFieldMobileApp_password.data.data[0]?.id
      if (_passwordFieldId) {
        setPasswordFieldId(_passwordFieldId)
      } else {
        const getGategoryFields2 = await axios.get('https://app.salesap.ru/api/v1/custom-field-categories?filter[class-name]=User', config);
        const categoryId2 = await getGategoryFields2.data.data[0].id
        const dataFieldPassword2 = {
          "data": {
            "type": "custom-fields",
            "attributes": {
              "required": false,
              "resource-name": "users",
              "field-type": "text",
              "name": "passwordMobileApp"
            },
            "relationships": {
              "custom-field-category": {
                "data": {
                  "type": "custom-field-categories",
                  "id": categoryId2
                }
              }
            }
          }
        }
        const setFieldMobileApp_password = await axios.post('https://app.salesap.ru/api/v1/custom-fields', dataFieldPassword2, config)
        setPasswordFieldId(setFieldMobileApp_password.data.data.id);
      }
    }
    if (token)
      fetching();
  }, [token])

  useEffect(() => {
    if (passwordFieldId && tokenFieldId && user.attributes) {
      setPassword(user.attributes.customs[`custom-${passwordFieldId}`])
      setEmail(user.attributes.email)
    }
  }, [user, passwordFieldId, tokenFieldId])

  useEffect(() => {
    async function getUserInfo() {
      const user = await axios.get(`https://app.salesap.ru/api/v1/users/${userid}`, config)
      setUser(() => { console.log(user.data.data); return user.data.data });
    }
    if (userid)
      getUserInfo()
  }, [userid])

  return (
    <div className="App w-full">
      <header className="App-header">
        <div className="flex items-center">
          <div className="h-[1px] w-full bg-[#ddd]" />
          <h1 className="font-bold whitespace-nowrap pl-2 pr-2 text-4xl">Cargo S2</h1>
          <div className="h-[1px] w-full bg-[#ddd]" />
        </div>
        <form className="flex flex-col gap-3" onSubmit={(e) => submit(e)}>
          <p className="mt-4 p-2 text-xs text-[#b8b8b8] bg-[#f1f1f1]">Эти данные будут использованы при авторизации в приложении, инструкция по <a className="text-[#6586f2]" href="https://app.salesap.ru/articles/2663" target="_blank" rel="noreferrer">ссылке</a></p>
          <label className="flex gap-4">
            <span className="basis-1/4">Логин</span>
            <input className="basis-3/4 outline-none border border-solid border-t-0 border-l-0 border-r-0" type='text' value={email} disabled="disabled" />
          </label>
          <label className="flex gap-4">
            <span className="basis-1/4">Пароль</span>
            <input className="basis-3/4 outline-none border border-solid border-t-0 border-l-0 border-r-0" type='text' value={password} onChange={(e)=>{setPassword(e.target.value)}} required />
          </label>
          {/* <label className="flex gap-4">
            <span className="basis-1/4">Токен</span>
            <input className="basis-3/4 outline-none border border-solid border-t-0 border-l-0 border-r-0" type='text' value={token} disabled="disabled" />
          </label> */}
          <button type='submit' className={`w-full bg-[#3162bc] pt-2 pb-2 text-white text-center ${save !== "Сохранить" && passwordFieldId && tokenFieldId ? 'opacity-50' : ''}`} disabled={save !== "Сохранить" && passwordFieldId && tokenFieldId}>{save}</button>
        </form>
      </header>
    </div>
  );
}

export default App;
