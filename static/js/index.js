const sacola = $("#sacola_input")

const barra_todos_produtos = $("#barra_produtos_tudo")

function mover_barra_produtos(id, valor_modificar, valor_maximo) {
    let barra_produtos = $(`#${id}`)
    let valor_x_atual = parseFloat($(`#valor_x_${id}`).val())
    let valor_resultante = valor_x_atual + valor_modificar

    if (valor_resultante >= valor_maximo && valor_resultante <= 0) {
        barra_produtos.css("transform", `translateX(${valor_resultante}vw)`)
        $(`#valor_x_${id}`).val(valor_resultante)
    }

    console.log(valor_x_atual, valor_resultante, valor_maximo)
}

function adicionar_a_sacola(item) {
    let itens_ja_adicionados = sacola.val()
    if (!itens_ja_adicionados.includes(item)) {
        sacola.val(`${itens_ja_adicionados}|${item}|`)
    }
    console.log(sacola.val())
}

document.addEventListener("DOMContentLoaded", inserir_produtos_no_documento("todos"))

function inserir_produtos_no_documento(tipo) {
    if (tipo == "todos") {
        $.ajax({
            url: "https://ecologica-e-commerce-default-rtdb.firebaseio.com/produtos.json",
            type: "GET",
            success: function(produtos) {
                let numero_de_produtos = 0
                for (produto in produtos) {
                    numero_de_produtos += 1
                }

                barra_todos_produtos.append(`<span class="categoria_produtos" id="categoria_produtos_tudo"></span><div class="setas_com_produtos"><input value="0" id="valor_x_produtos_todo" style="display: none"><div class="seta seta_esquerda" onclick="mover_barra_produtos('produtos_todo', 18.99, ${(5-numero_de_produtos)*18.99})"></div><span class="seta_span seta_span_esquerda"></span><span class="seta_span seta_span_direita"></span><div class="seta seta_direita" onclick="mover_barra_produtos('produtos_todo', -18.99, ${(5-numero_de_produtos)*18.99})"></div><div id="produtos_todo"></div></div>`)
                let div_produtos = $("#produtos_todo")

                for (produto in produtos) {
                    let img = produtos[produto]["img"]
                    let tamanho = produtos[produto]["tamanho"]
                    let valor = produtos[produto]["valor"]

                    div_produtos.append(`<div class="produto"><img draggable="false" class="imagem_demonstração" src="static/${img}.png"><span class="texto_produto">${produto[0].toUpperCase() + produto.substring(1)}</span><span class="desc_tamanho">Tamanho ${tamanho}</span><span class="valor">R$ ${valor} <button class="btn_comprar" onclick="adicionar_a_sacola('${produto}')" type="button">Comprar</button></span></div>`)
                }

                muda_visibilidade_loading("hidden")
            },
            error: function(erro) {
                console.log(erro)
            }
        })
    }
}

function muda_visibilidade_loading(visibilidade) {
    $("#background_loading").css("visibility", visibilidade)
    $("#img_loading").css("visibility", visibilidade)
}
