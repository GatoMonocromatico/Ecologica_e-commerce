const lista_de_itens = $("#lista_itens")
const soma_produtos_valores = $("#soma_produtos_valores")
const soma_produtos_nomes = $("#soma_produtos_nomes")
const valor_da_compra_texto = $("#valor_da_compra_texto")
const form = $("#form")
const input_telefone = $("#input_telefone")
const span_erro = $("#input_telefone_erro")
const label_input_telefone = $("#label_input_telefone")
const imagem_sacola_vazia = $("#img_sacola_vazia")
const info_bruta_itens_lista = $("#itens_sacola").val()
const btn_finalizar_compra = $("#btn_comprar")

function redirecionar_para_index() {
    window.location.href = "http://127.0.0.1:5000/"
}

function modificar_quantidade(item_index, quantidade_a_modificar, valor_maximo) {
    let text_qtd = $(`#lista_qtd_${item_index}`)
    let valor_atual = text_qtd.val()
    let valor_modificado = parseInt(valor_atual) + parseInt(quantidade_a_modificar)
    let desc_max = $(`#qtd_maximo_lista_${item_index}`)

    if (valor_modificado >= 1 && valor_modificado < valor_maximo) {
        desc_max.css("visibility", "hidden")
        text_qtd.val(valor_modificado)
        console.log(1)
    }
    else if (valor_modificado == valor_maximo) {
        desc_max.css("visibility", "visible")
        text_qtd.val(valor_modificado)
    }
}

function excluir_item(item_index) {
    let item = document.getElementById(`item_lista_${item_index}`)
    let nome_na_soma_valor = document.getElementById(`soma_produtos_nome_${item_index}`)
    let valor_na_soma = document.getElementById(`soma_produtos_valor_${item_index}`)
    let valor_total_compra_elemento = document.getElementById("valor_da_compra_texto")

    let valor_total_compra = parseInt(valor_total_compra_elemento.innerHTML.replace("R$ ", ""))
    let valor_do_item = parseInt(valor_na_soma.innerHTML.replace("R$ ", ""))
    let valor_resultante = valor_total_compra - valor_do_item

    item.parentNode.removeChild(item)
    nome_na_soma_valor.parentNode.removeChild(nome_na_soma_valor)
    valor_na_soma.parentNode.removeChild(valor_na_soma)

    valor_total_compra_elemento.innerHTML = `R$ ${valor_resultante},00`

    if (lista_de_itens.html() == "") {
        imagem_sacola_vazia.css("visibility", "visible")
        btn_finalizar_compra.attr("disabled", "disabled")
        $("#disclaimer_endereço").css("visibility", "hidden")
    }
} 

function inserir_itens_na_lista() {
    let itens = info_bruta_itens_lista
    itens = itens.replaceAll("||", ", ")
    itens = itens.replaceAll("|", "") 
    itens = itens.split(", ")
    lista_de_itens.html("")

    if (itens != '') {
        for (item in itens) {
            let nome = (itens[item]).toLowerCase()
            ajax_inserir_itens_na_lista(nome, item)
        }
    }
    else {
        muda_visibilidade_loading("hidden")
        imagem_sacola_vazia.css("visibility", "visible")
        valor_da_compra_texto.html("R$ 00,00")
        btn_finalizar_compra.attr("disabled", "disabled")
        $("#disclaimer_endereço").css("visibility", "hidden")

    }
}

function ajax_inserir_itens_na_lista(produto, index) {
    let nome = produto[0].toUpperCase() + produto.substring(1);

    $.ajax({
        url: `https://ecologica-e-commerce-default-rtdb.firebaseio.com/produtos/${produto}/.json`,
        type: "GET",
        success: function (infos) {
            muda_visibilidade_loading("visible")
            let imagem = infos["img"]
            let valor = infos["valor"]
            let tamanho = infos["tamanho"]
            let estoque = infos["estoque"]
            
            let quantidade_unica = ""

            if (estoque == "1") {
                quantidade_unica = " quantidade_unica"
            }

            let html_item = `<div class="item_lista_compras" id="item_lista_${index}"><div class="item_desc_img"><img src="static/${imagem}.png" class="img_lista_compras"><div class="desc_item"><span class="nome_item">${nome}</span><span class="tamanho_item">Tamanho ${tamanho}</span></div></div><div class="quantidade_do_produto_lista_compras_com_titulo${quantidade_unica}">Quantidade<div class="quantidade_do_produto_lista_compras"><button class="quantidade_do_produto_btn_mais" onclick="modificar_quantidade(${index}, 1, ${estoque})">+</button><textarea  class="quantidade_do_produto_display_qtd" id="lista_qtd_${index}">1</textarea><button class="quantidade_do_produto_btn_menos" onclick="modificar_quantidade(${index}, -1, ${estoque})">-</button></div><span class="center_text" id="qtd_maximo_lista_${index}" style="visibility: hidden">Máximo</span></div><span class="valor_produto_lista_compras"><span class="valor_produto_lista_compras_desc">valor</span>R$ ${valor}</span><div class="excluir_item_lista" onclick="excluir_item(${index})"><div class="linha_x"></div><div class="linha_x"></div></div></div>`
            lista_de_itens.append(html_item)
        
            let valor_da_compra_atual;
            let valor_da_compra;
        
            let padrao_valor_da_compra;
                
            soma_produtos_nomes.append(`<span class="soma_produtos_texto" id="soma_produtos_nome_${index}">${nome}</span>`)
            soma_produtos_valores.append(`<span class="soma_produtos_texto" id="soma_produtos_valor_${index}">R$ ${valor}</span>`)
        
            if (valor_da_compra_texto.html() == "") {
                valor_da_compra_atual = 0
                console.log("primeira entrada")
            }
            else {
                let valor = valor_da_compra_texto.html().replace("R$ ", "")
                valor_da_compra_atual = parseFloat(valor.replace(",", "."))
                console.log("entrou certo", valor_da_compra_atual)
            }
        
            valor_da_compra = (valor_da_compra_atual + parseFloat(valor.replace(",", "."))).toString()
            valor_da_compra = valor_da_compra.replace(".", ",")
            padrao_valor_da_compra = /^\d*\,\d\d$/
            while (!valor_da_compra.match(padrao_valor_da_compra)) {
                if (valor_da_compra.includes(",")) {
                    valor_da_compra = valor_da_compra + "0"
                }
                else {
                    valor_da_compra = valor_da_compra + ",00"
                }
            }
        
            valor_da_compra_texto.html(`R$ ${valor_da_compra}`)
            muda_visibilidade_loading("hidden")
        },
        error: function (e) {
            console.log(e)
        }
    })
}

function muda_visibilidade_loading(visibilidade) {
    $("#background_loading").css("visibility", visibilidade)
    $("#img_loading").css("visibility", visibilidade)
}

document.addEventListener("DOMContentLoaded", inserir_itens_na_lista())
form.on("submit", function(event) {
    let padrao_telefone = /\(?\d{2}\)?\s?9\d{4}-?\d{4}/
    let celular = input_telefone.val()

    if (!celular.match(padrao_telefone)) {
        event.preventDefault()
        span_erro.css("visibility", "visible")
        span_erro.css("animation", "piscar 450ms linear forwards")
        label_input_telefone.css("animation", "piscar 450ms linear forwards")
    }
})