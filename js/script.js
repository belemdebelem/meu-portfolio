(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLabel = document.querySelector(".nav-toggle-label");

  function setNavigation(open) {
    if (!header || !navToggle) return;
    header.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    if (navLabel) navLabel.textContent = open ? "Fechar" : "Menu";
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setNavigation(!header.classList.contains("is-open"));
    });
  }

  if (header) {
    document.addEventListener("click", function (event) {
      if (!header.classList.contains("is-open")) return;
      if (!header.contains(event.target)) setNavigation(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !header.classList.contains("is-open")) return;
      setNavigation(false);
      if (navToggle) navToggle.focus();
    });

    header.querySelectorAll(".site-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavigation(false);
      });
    });

    const desktopQuery = window.matchMedia("(min-width: 861px)");
    const closeOnDesktop = function (event) {
      if (event.matches) setNavigation(false);
    };

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", closeOnDesktop);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(closeOnDesktop);
    }
  }

  const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const observedSections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          navLinks.forEach(function (link) {
            const isCurrent = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-current", isCurrent);

            if (isCurrent) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    observedSections.forEach(function (section) {
      spy.observe(section);
    });
  }

  const projects = {
    crm: {
      kicker: "Projeto 01 · Automação",
      title: "Automação de demandas CRM",
      subtitle:
        "Dois scripts em Python para transformar um relatório operacional do CRM em um Excel organizado e em e-mails de reiteração enviados em lote.",
      context:
        "A rotina de um setor de atendimento em uma instituição financeira envolvia classificar manualmente demandas exportadas do CRM, separar o que precisava de cobrança e montar e-mails área por área.",
      approach:
        "O primeiro script lê o relatório bruto, aplica as regras de negócio e gera um Excel dividido em abas por tipo de tratamento. O segundo lê a aba de reiteração, agrupa as demandas por área responsável, calcula o status de prazo e envia os e-mails em lote.",
      highlights: [
        "Abas para demandas respondidas, a reiterar, a prorrogar, totais, não respondidas e CPF duplicado.",
        "Envio de e-mails padronizados com regras de cópia, status de prazo e relatório consolidado.",
        "Dados sensíveis mantidos fora do código por variáveis de ambiente; a base pública do repositório é fictícia."
      ],
      tools: ["Python", "Pandas", "openpyxl", "Excel", "Outlook"],
      repo: "https://github.com/belemdebelem/automacao-demandas-crm"
    },
    pipeline: {
      kicker: "Projeto 02 · ETL & cloud",
      title: "Pipeline de dados do Desenrola",
      subtitle:
        "Um pipeline ETL serverless de ponta a ponta para os dados públicos do Programa Desenrola, do CSV do Banco Central ao dashboard.",
      context:
        "A base do Banco Central do Brasil reúne o volume de renegociações do Programa Desenrola por mês, conglomerado financeiro e unidade da federação.",
      approach:
        "O ETL em Python baixa e padroniza o CSV, deriva ano e mês, enriquece os dados com UF e região e grava Parquet particionado no Amazon S3. O catálogo fica no AWS Glue, as consultas no Athena e a visualização em um dashboard Streamlit com fallback local.",
      highlights: [
        "Partições por ano e mês para reduzir a leitura de dados nas consultas do Athena.",
        "Oito testes unitários cobrem a transformação, sem depender de internet.",
        "Dashboard com KPIs, série histórica, ranking de conglomerados, mapa por UF e filtros.",
        "O modo local funciona sem credenciais AWS, usando o Parquet gerado pelo pipeline."
      ],
      tools: ["Python", "Pandas", "AWS S3", "AWS Glue", "Athena", "Streamlit", "Plotly"],
      repo: "https://github.com/belemdebelem/pipeline-dados-desenrola-aws"
    },
    contratos: {
      kicker: "Projeto 03 · Análise",
      title: "Contratos de TIC do TJ-PA",
      subtitle:
        "Uma análise dos contratos de tecnologia do Tribunal de Justiça do Pará em 2023 e 2024, com foco na concentração de fornecedores.",
      context:
        "A análise parte da base pública de contratos e atas de registro de preços do Portal da Transparência do TJ-PA e investiga quanto do orçamento de TIC está associado a grandes fornecedores internacionais.",
      approach:
        "A partir de 1.014 contratos, o notebook aplica filtros de natureza TIC e palavras-chave, normaliza valores monetários, mapeia revendas brasileiras para as marcas fabricantes e agrega os resultados em gráficos de barras e pizza.",
      highlights: [
        "Sete contratos de TIC identificados em 2023–2024, totalizando aproximadamente R$ 50,5 milhões.",
        "Microsoft concentra cerca de 72% do valor, seguida por Red Hat, Veeam e Oracle.",
        "A análise discute dependência de fornecedores internacionais e soberania digital no setor público."
      ],
      tools: ["Python", "Pandas", "Matplotlib", "Google Colab"],
      repo: "https://github.com/belemdebelem/analise-contratos-tic-tjpa"
    },
    transacoes: {
      kicker: "Projeto 04 · Risco",
      title: "Transações financeiras suspeitas",
      subtitle:
        "Um projeto didático que combina geração de dados sintéticos, regras explicáveis de risco e uma arquitetura orientada a eventos na AWS.",
      context:
        "O repositório demonstra, de forma reproduzível, como estruturar um fluxo de monitoramento de transações: ingestão, validação, deduplicação, aplicação de regras, persistência e alertas.",
      approach:
        "O projeto gera lotes fictícios, valida os registros e calcula um score de risco de 0 a 100 com motivos associados. No fluxo AWS, um arquivo no S3 pode acionar uma Lambda, com integrações opcionais para DynamoDB, SNS e CloudWatch.",
      highlights: [
        "Quatro níveis de risco: normal, atenção, suspeita e crítica.",
        "Regras determinísticas e explicáveis, com motivos associados a cada alerta.",
        "Métricas operacionais do lote, incluindo volume, alertas, motivos e contas mais sinalizadas.",
        "Dados sintéticos: as regras são didáticas e não comprovam fraude."
      ],
      tools: ["Python", "AWS Lambda", "Amazon S3", "DynamoDB", "SNS", "CloudWatch"],
      repo: "https://github.com/belemdebelem/transacoes-financeiras-suspeitas"
    }
  };

  const dialog = document.getElementById("projeto-dialog");
  const dialogKicker = dialog ? dialog.querySelector("[data-dialog-kicker]") : null;
  const dialogTitle = dialog ? dialog.querySelector("[data-dialog-title]") : null;
  const dialogContent = dialog ? dialog.querySelector("[data-dialog-content]") : null;
  const dialogClose = dialog ? dialog.querySelector("[data-dialog-close]") : null;
  let lastFocusedElement = null;

  function openProject(projectKey, opener) {
    const project = projects[projectKey];
    if (!project || !dialog || !dialogTitle || !dialogContent) return;

    lastFocusedElement = opener || document.activeElement;

    dialogKicker.textContent = project.kicker;
    dialogTitle.textContent = project.title;
    dialogContent.innerHTML =
      '<p class="dialog-subtitle">' +
      project.subtitle +
      "</p>" +
      '<section class="dialog-section">' +
      "<h3>Contexto</h3><p>" +
      project.context +
      "</p></section>" +
      '<section class="dialog-section">' +
      "<h3>Como funciona</h3><p>" +
      project.approach +
      "</p></section>" +
      '<section class="dialog-section">' +
      "<h3>Destaques</h3><ul class=\"dialog-highlights\">" +
      project.highlights
        .map(function (item) {
          return "<li>" + item + "</li>";
        })
        .join("") +
      "</ul></section>" +
      '<div class="dialog-footer">' +
      '<ul class="tech-list" aria-label="Tecnologias do projeto">' +
      project.tools
        .map(function (tool) {
          return "<li>" + tool + "</li>";
        })
        .join("") +
      "</ul>" +
      '<a class="btn" href="' +
      project.repo +
      '" target="_blank" rel="noopener">Abrir repositório <span aria-hidden="true">↗</span><span class="sr-only">(abre em nova aba)</span></a>' +
      "</div>";

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    document.body.classList.add("dialog-open");
  }

  function closeProject() {
    if (!dialog) return;
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      document.body.classList.remove("dialog-open");
      if (lastFocusedElement) lastFocusedElement.focus();
    }
  }

  document.querySelectorAll("[data-open-project]").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      openProject(button.getAttribute("data-open-project"), button);
    });
  });

  document.querySelectorAll("[data-project-card]").forEach(function (card) {
    card.addEventListener("click", function (event) {
      if (event.target.closest("a, button")) return;
      const opener = card.querySelector("[data-open-project]");
      openProject(card.getAttribute("data-project-card"), opener);
    });
  });

  if (dialog) {
    if (dialogClose) {
      dialogClose.addEventListener("click", closeProject);
    }

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closeProject();
    });

    dialog.addEventListener("close", function () {
      document.body.classList.remove("dialog-open");
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    });
  }

  const carousel = document.querySelector("[data-carousel]");

  if (carousel) {
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = Array.from(carousel.querySelectorAll(".talk-slide"));
    const previousButtons = Array.from(carousel.querySelectorAll("[data-carousel-prev]"));
    const nextButtons = Array.from(carousel.querySelectorAll("[data-carousel-next]"));
    const dotsContainer = carousel.querySelector("[data-carousel-dots]");
    const status = carousel.querySelector("[data-carousel-status]");
    let currentIndex = 0;
    let touchStartX = null;

    const dots = slides.map(function (slide, index) {
      const title = slide.querySelector("h3");
      const dot = document.createElement("button");
      const line = document.createElement("span");

      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute(
        "aria-label",
        "Ir para palestra " + (index + 1) + (title ? ": " + title.textContent.trim() : "")
      );
      line.setAttribute("aria-hidden", "true");
      dot.appendChild(line);
      dot.addEventListener("click", function () {
        goToSlide(index);
      });

      if (dotsContainer) dotsContainer.appendChild(dot);
      return dot;
    });

    function goToSlide(index) {
      const activeElement = document.activeElement;
      const activeControl = activeElement && activeElement.closest
        ? activeElement.closest("[data-carousel-prev], [data-carousel-next]")
        : null;
      const focusControl = activeControl
        ? (activeControl.hasAttribute("data-carousel-prev") ? "prev" : "next")
        : null;

      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = "translateX(-" + currentIndex * 100 + "%)";

      slides.forEach(function (slide, slideIndex) {
        const isCurrent = slideIndex === currentIndex;
        slide.setAttribute("aria-hidden", String(!isCurrent));

        if ("inert" in slide) {
          slide.inert = !isCurrent;
        }
      });

      dots.forEach(function (dot, dotIndex) {
        if (dotIndex === currentIndex) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });

      if (status) {
        const activeTitle = slides[currentIndex].querySelector("h3");
        status.textContent =
          "Palestra " +
          (currentIndex + 1) +
          " de " +
          slides.length +
          (activeTitle ? ": " + activeTitle.textContent.trim() : "");
      }

      if (focusControl) {
        const target = slides[currentIndex].querySelector(
          focusControl === "prev" ? "[data-carousel-prev]" : "[data-carousel-next]"
        );
        if (target) target.focus({ preventScroll: true });
      }
    }

    previousButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        goToSlide(currentIndex - 1);
      });
    });

    nextButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        goToSlide(currentIndex + 1);
      });
    });

    carousel.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSlide(currentIndex + 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToSlide(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToSlide(slides.length - 1);
      }
    });

    carousel.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "touch") touchStartX = event.clientX;
    });

    carousel.addEventListener("pointerup", function (event) {
      if (event.pointerType !== "touch" || touchStartX === null) return;
      const distance = event.clientX - touchStartX;
      touchStartX = null;

      if (Math.abs(distance) < 45) return;
      goToSlide(distance > 0 ? currentIndex - 1 : currentIndex + 1);
    });

    carousel.addEventListener("pointercancel", function () {
      touchStartX = null;
    });

    goToSlide(0);
  }
})();
