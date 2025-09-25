import React, { useState } from "react";
import './'

function cadastroUsuariopages(){

    const [formData, setFormDate] = useState({
        dominio: '',
        nome: '',
        email: '',
        senha: '',
    });

    const handleChange = (event) => {
        const{nome, value} = event.target;
        setFormData((prevData) => ({
            prevData,
            [nome]: value,
        }));
    };

    const handleSubmit = (event) =>{
        event.prevenDefault(); //impede o carregamento da pagi
        console.log('Dados do formulario enviados:', formData);

        alert(`Cadastro de ${formData.nome} realizado com sucesso!`);

    };

    return(
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Tela de Cadastro</h2>

                <div className="form-group">
                    <label htmlFor="dominio">Dominio</label>
                    <input 
                    type="text"
                    id="dominio"
                    name="dominio"
                    value={formData.dominio}
                    onChange={handleChange}
                    required
                     />
                </div>

                 <div className="form-group">
                 <label htmlFor="nome">Nome Completo</label>
                 <input
                  type="text"
                  id="nome"
                 name="nome"
                 value={formData.nome}
                 onChange={handleChange}
                 required
                 />
                </div>

                 <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                     id="email"
                    name="email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                     />
                      </div>
                        
        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default   cadastroUsuariopages;
