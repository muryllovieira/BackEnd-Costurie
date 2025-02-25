/*****************************************************************************
 * Objetivo: Model para a captacão de dados do banco de dados e envio para as controllers
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client')

var prisma = new PrismaClient()

const insertUsuarioModel = async (dadosUsuario) => {
    let sql = `
    insert into tbl_usuario (
        nome_de_usuario, 
        email, 
        senha) values (
            ?, 
            ?, 
            ?
            );`

    // console.log(sql);


    let resultStatus = await prisma.$executeRawUnsafe(sql, dadosUsuario.nome_de_usuario, dadosUsuario.email, dadosUsuario.senha)

    // console.log(resultStatus);

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

//Retorna o ultimo id inserido pelo banco de dados
const selectLastIDUsuarioModel = async () => {

    let sql = `select 
                    tbl_usuario.id as id_usuario, 
                    tbl_usuario.nome_de_usuario as tag_usuario, 
                    tbl_usuario.email  
                from tbl_usuario order by id desc limit 1;`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }

}

const selectUserByLoginModel = async (dadosLogin) => {
    let sql = `select tbl_usuario.id ,tbl_usuario.nome_de_usuario, tbl_usuario.email from tbl_usuario where tbl_usuario.email = ? and tbl_usuario.senha = ?`

    let response = await prisma.$queryRawUnsafe(sql, dadosLogin.email, dadosLogin.senha)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectUserByEmailModel = async (email) => {
    let sql = `select tbl_usuario.id, tbl_usuario.nome_de_usuario, tbl_usuario.email from tbl_usuario where tbl_usuario.email = ?;`

    let response = await prisma.$queryRawUnsafe(sql, email.email)
    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectUserByPasswordModel = async (senha) => {
    let sql = `select tbl_usuario.id, tbl_usuario.nome_de_usuario, tbl_usuario.senha from tbl_usuario where tbl_usuario.senha = ?;`

    let response = await prisma.$queryRawUnsafe(sql, senha)
    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectUserByIdModel = async (id) => {
    // console.log(id);
    let sql = `select
                    tbl_localizacao.id AS id_localizacao,
                    tbl_localizacao.cidade,
                    tbl_localizacao.estado,
                    tbl_localizacao.bairro,
                    tbl_usuario.id AS id_usuario,
                    tbl_usuario.nome_de_usuario,
                    tbl_usuario.descricao,
                    tbl_usuario.foto,
                    tbl_usuario.email,
                    tbl_usuario.senha,
                    tbl_usuario.nome
                from
                    tbl_localizacao
                inner join
                    tbl_usuario
                on
                    tbl_usuario.id_localizacao = tbl_localizacao.id
                    where tbl_usuario.id = ?;`

    let response = await prisma.$queryRawUnsafe(sql, id)

    console.log(response);
    // console.log(sql);

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const updateUserTokenAndExpiresModel = async (id, token, tempo_expiracao) => {
    //Script sql para atualizar os dados no BD
    let sql = `update tbl_usuario set token = ?, tempo_expiracao = ? where id = ?;`

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql, token, tempo_expiracao, id)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const selectTokenAndIdModel = async (dadosBody) => {
    let sql = `select 
    tbl_usuario.id, 
    tbl_usuario.nome, 
    tbl_usuario.nome_de_usuario, 
    tbl_usuario.email, tbl_usuario.token, 
    tbl_usuario.tempo_expiracao 
    from tbl_usuario where tbl_usuario.token = ? and tbl_usuario.id = ?`

    let response = await prisma.$queryRawUnsafe(sql, dadosBody.token, dadosBody.id)

    // console.log(response);

    if (response.length > 0) {
        return response
    } else {
        return false
    }
} 

const updateUserPasswordModel = async (dadosBody) => {
    //Script sql para atualizar os dados no BD
    let sql = `update tbl_usuario set senha = ? where id = ?`

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql, dadosBody.senha, dadosBody.id)

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const dadosUpdatePersonalizarPerfilModel = async (dadosBody) => {
    //Script sql para atualizar os dados no BD
    let sql = `update tbl_usuario set nome = ?, descricao = ?, foto = ? where id = ?;`

    // console.log(sql);

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql, dadosBody.nome, dadosBody.descricao, dadosBody.foto, dadosBody.id)

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const selectUserByEmailTagNameModel = async (dadosBody) => {
    let sql = `select tbl_usuario.id ,tbl_usuario.nome_de_usuario, tbl_usuario.email from tbl_usuario 
                    where 
                    tbl_usuario.email = ?
                    and tbl_usuario.nome_de_usuario = ?;`

    let response = await prisma.$queryRawUnsafe(sql, dadosBody.email, dadosBody.nome_de_usuario)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectProfileByIdModel = async (id) => {
    let sql = `select * from tags_usuario where id_usuario = ?;`
    // console.log(sql);

    let response = await prisma.$queryRawUnsafe(sql, id)
    // console.log(response);

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const updateProfileTagLocalityModel = async (dadosBody) => {
    // console.log(dadosBody);

    //Script sql para atualizar os dados no BD
    let sql = `CALL sp_update_endereco_usuario_tag(
        ${dadosBody.id_usuario},        -- Substitua pelo ID do usuário
        ${dadosBody.id_localizacao},        -- Substitua pelo ID do endereço
        '${dadosBody.bairro}',      -- Substitua pelo novo valor do bairro
        '${dadosBody.cidade}',      -- Substitua pelo novo valor da cidade
        '${dadosBody.estado}',      -- Substitua pelo novo valor do estado
        '${dadosBody.nome}',        -- Substitua pelo novo valor do nome
        '${dadosBody.descricao}',   -- Substitua pela nova descrição
        '${dadosBody.foto}',        -- Substitua pela nova URL da foto
        '${dadosBody.nome_de_usuario}' -- Substitua pelo novo nome de usuário
    );`

    //Executa o script no BD
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    // console.log(dadosBody);

    if (resultStatus) {
        return resultStatus
    } else {
        return false
    }
}

const selectAllUsersModel = async () => {
    let sql = `select * from tbl_usuario`

    let response = await prisma.$queryRawUnsafe(sql)

    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const deleteUserByIdModel = async (id) => {
    let sql = `delete from tbl_usuario where id = ?`

    // console.log(sql);

    let response = await prisma.$executeRawUnsafe(sql, id)

    if (response) {
        return true
    } else {
        return false
    }
}

const selectUserAndLocalityById = async (id) => {
    let sql = `select  tbl_usuario.id as id_usuario,
                    tbl_usuario.nome as nome,
                    tbl_usuario.descricao as descricao,
                    tbl_usuario.foto as foto,
                    tbl_usuario.nome_de_usuario as nome_de_usuario,
                    tbl_usuario.email as email,
                    tbl_usuario.senha as senha, 
                    tbl_usuario.id_localizacao as id_localizacao,
                    tbl_localizacao.bairro as bairro,
                    tbl_localizacao.cidade as cidade,
                    tbl_localizacao.estado as estado
                from tbl_usuario
                inner join tbl_localizacao
                    on tbl_localizacao.id = tbl_usuario.id_localizacao
                where tbl_usuario.id = ?`

    let response = await prisma.$queryRawUnsafe(sql, id)

    // console.log(response);

    if (response.length > 0) {
        return response
    } else {
        return false
    }
} 

const selectUserEmailModel = async (email) => {
    let sql = `select tbl_usuario.id, tbl_usuario.nome_de_usuario, tbl_usuario.email from tbl_usuario where tbl_usuario.email = ?`

    let response = await prisma.$queryRawUnsafe(sql, email)
    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectUserByTagNameModel = async (nome_de_usuario) => {
    let sql = `select tbl_usuario.id, tbl_usuario.nome_de_usuario, tbl_usuario.email from tbl_usuario where tbl_usuario.nome_de_usuario = ?`

    let response = await prisma.$queryRawUnsafe(sql, nome_de_usuario)
    // console.log(response);
    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

const selectUserById = async (id_usuario) => {
    let sql = `select * from tbl_usuario where id = ?`

    let response = await prisma.$queryRawUnsafe(sql, id_usuario)
    // console.log(response);
    if (response.length > 0) {
        return response
    } else {
        return false
    }
}

module.exports = {
    insertUsuarioModel,
    selectLastIDUsuarioModel,
    selectUserByLoginModel,
    selectUserByEmailModel,
    selectUserByIdModel,
    updateUserTokenAndExpiresModel,
    selectTokenAndIdModel,
    updateUserPasswordModel,
    dadosUpdatePersonalizarPerfilModel,
    selectUserByEmailTagNameModel,
    selectProfileByIdModel,
    updateProfileTagLocalityModel,
    selectAllUsersModel,
    deleteUserByIdModel,
    selectUserAndLocalityById,
    selectUserEmailModel,
    selectUserByTagNameModel,
    selectUserById,
    selectUserByPasswordModel
}