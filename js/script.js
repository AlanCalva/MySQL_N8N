document.addEventListener('DOMContentLoaded', () => {

    // 🌐 URL DE NODO WEBHOOK EN N8N
    const N8N_WEBHOOK_URL = "https://alancalva.app.n8n.cloud/webhook/b5e7f13f-047e-414c-ac64-64716387491c";

    // 🔹 Referencias a los elementos del DOM
    const btnCalcular = document.getElementById('btnCalcular');
    const textoOperacion = document.getElementById('textoOperacion');
    const divResultado = document.getElementById('divResultado');
    const resultadoTexto = document.getElementById('resultadoTexto');
    const divError = document.getElementById('divError');
    const errorTexto = document.getElementById('errorTexto');
    const textoOriginalBtn = 'Calcular <i class="bi bi-lightning-charge-fill"></i>';

    // 🔹 Evento principal
    btnCalcular.addEventListener('click', async () => {
        const query = textoOperacion.value.trim();

        if (query === "") {
            alert("Por favor, escribe una operación.");
            return;
        }

        // --- Estado de carga ---
        divResultado.style.display = 'none';
        divError.style.display = 'none';
        btnCalcular.disabled = true;
        btnCalcular.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Calculando...
        `;

        try {
            // 🌎 Obtener IP pública del usuario
            const ipResponse = await fetch("https://api.ipify.org?format=json");
            const ipData = await ipResponse.json();
            const ipPublica = ipData.ip || "0.0.0.0";

            // 🚀 Enviar datos al webhook de n8n
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    textoUsuario: query,
                    ip_publica: ipPublica   // 👈 Aquí enviamos la IP real
                })
            });

            if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);
            
            const data = await response.json();

            // --- Mostrar resultado ---
            resultadoTexto.innerText = data.respuestaCalculada;
            divResultado.style.display = 'block';
        } catch (error) {
            console.error("Error:", error);
            errorTexto.innerText = "Hubo un error al procesar la solicitud.";
            divError.style.display = 'block';
        } finally {
            btnCalcular.disabled = false;
            btnCalcular.innerHTML = textoOriginalBtn;
        }
    });
});
