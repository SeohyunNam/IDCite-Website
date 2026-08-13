(function () {
  "use strict";

  var FONT = "Inter, system-ui, sans-serif";
  var GRID = "rgba(27, 35, 48, 0.08)";
  var TICK = "#5c6675";
  var STEEL = "#2c5d84";

  /* ---------- Data ---------- */
  var intents = [
    { name: "background", count: 1660899, color: "#1e3a5f" },
    { name: "uses", count: 131827, color: "#355880" },
    { name: "similarities", count: 45753, color: "#4e739b" },
    { name: "motivation", count: 21555, color: "#698eb3" },
    { name: "differences", count: 15617, color: "#8aa7c6" },
    { name: "future work", count: 4654, color: "#adc2d9" },
    { name: "extends", count: 2813, color: "#c2d0e0" }
  ];

  var fields = [
    ["Multidisciplinary", 6516], ["Materials Science", 3686], ["Physics", 3325],
    ["Chemistry", 2896], ["Clinical Medicine", 2076], ["Plant & Animal Science", 1936],
    ["Agricultural Sciences", 1412], ["Engineering", 999], ["Arts & Humanities", 990],
    ["Mathematics", 876], ["Economics & Business", 843], ["Environment/Ecology", 561],
    ["Computer Science", 475], ["Literature & Language", 468], ["Biology & Biochemistry", 440],
    ["Geosciences", 410], ["Social Sciences, General", 227], ["Philosophy & Religion", 165],
    ["Psychiatry/Psychology", 150], ["History & Archaeology", 134], ["Visual & Performing Arts", 112]
  ];

  var mapping = [
    ["Agricultural Sciences", "Agriculture, Dairy & Animal Science"],
    ["Arts & Humanities, Interdisciplinary", "Area Studies"],
    ["Biology & Biochemistry", "Biotechnology & Applied Microbiology"],
    ["Chemistry", "Chemistry, Physical"],
    ["Clinical Medicine", "Medicine, General & Internal"],
    ["Computer Science", "Computer Science, Artificial Intelligence"],
    ["Economics & Business", "Economics"],
    ["Engineering", "Engineering, Industrial"],
    ["Environment/Ecology", "Ecology"],
    ["Geosciences", "Geography, Physical"],
    ["History & Archaeology", "History"],
    ["Literature & Language", "Language & Linguistics"],
    ["Materials Science", "Materials Science, Ceramics"],
    ["Mathematics", "Mathematics"],
    ["Multidisciplinary", "Multidisciplinary Sciences"],
    ["Philosophy & Religion", "Philosophy"],
    ["Physics", "Physics, Applied"],
    ["Plant & Animal Science", "Plant Sciences"],
    ["Psychiatry/Psychology", "Psychology"],
    ["Social Sciences, General", "Sociology"],
    ["Visual & Performing Arts", "Film, Radio, Television"]
  ];

  var files = [
    ["citation_events.parquet", "1,857,503", 20, "Raw citation event records"],
    ["citation_events_enriched.parquet", "1,857,503", 32, "Citation events + cited seed-paper metadata"],
    ["citation_events_normalized.parquet", "1,857,503", 23, "Citation events with normalized intent & field IDs"],
    ["citing_papers.parquet", "1,467,045", 7, "Metadata of citing papers"],
    ["citing_papers_normalized.parquet", "1,467,045", 8, "Citing papers with normalized journal IDs"],
    ["seed_cited_papers.parquet", "23,479", 42, "Highly cited seed-paper metadata"],
    ["seed_cited_papers_normalized.parquet", "23,479", 48, "Seed papers with normalized entity IDs"],
    ["authors.parquet", "16,839", 2, "Author ID–name mapping"],
    ["affiliations.parquet", "5,271", 2, "Affiliation ID–name mapping"],
    ["affiliation_geo.parquet", "5,352", 6, "Affiliation, city & country mappings"],
    ["cities.parquet", "1,899", 2, "City ID–name mapping"],
    ["countries.parquet", "108", 2, "Country ID–name mapping"],
    ["journals.parquet", "46,237", 2, "Journal ID–name mapping"],
    ["fields.parquet", "21", 3, "Field ID–name mapping"],
    ["intents.parquet", "31", 2, "Citation intent ID–name mapping"]
  ];

  /* ---------- Populate tables ---------- */
  function fillMapping() {
    var body = document.getElementById("mappingBody");
    if (!body) return;
    mapping.forEach(function (r) {
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + r[0] + "</td><td>" + r[1] + "</td><td class='num'>5</td>";
      body.appendChild(tr);
    });
  }

  function fillFiles() {
    var body = document.getElementById("filesBody");
    if (!body) return;
    files.forEach(function (r) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td class='file'>" + r[0] + "</td>" +
        "<td class='num'>" + r[1] + "</td>" +
        "<td class='num'>" + r[2] + "</td>" +
        "<td>" + r[3] + "</td>";
      body.appendChild(tr);
    });
  }

  /* ---------- Charts ---------- */
  function intentChart() {
    var el = document.getElementById("intentChart");
    if (!el || !window.Chart) return;
    new Chart(el, {
      type: "bar",
      data: {
        labels: intents.map(function (i) { return i.name; }),
        datasets: [{
          data: intents.map(function (i) { return i.count; }),
          backgroundColor: intents.map(function (i) { return i.color; }),
          borderColor: "#16324f",
          borderWidth: 0.5,
          borderRadius: 2,
          maxBarThickness: 40
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x.toLocaleString() + " citations"; } } }
        },
        scales: {
          x: { type: "logarithmic", grid: { color: GRID }, ticks: { color: TICK, font: { family: FONT } } },
          y: { grid: { display: false }, ticks: { color: "#1b2330", font: { family: FONT, size: 13 } } }
        }
      }
    });
  }

  function fieldChart() {
    var el = document.getElementById("fieldChart");
    if (!el || !window.Chart) return;
    new Chart(el, {
      type: "bar",
      data: {
        labels: fields.map(function (f) { return f[0]; }),
        datasets: [{
          data: fields.map(function (f) { return f[1]; }),
          backgroundColor: STEEL,
          borderRadius: 2,
          maxBarThickness: 22
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return c.parsed.x.toLocaleString() + " seed papers"; } } }
        },
        scales: {
          x: { grid: { color: GRID }, ticks: { color: TICK, font: { family: FONT } } },
          y: { grid: { display: false }, ticks: { color: "#1b2330", font: { family: FONT, size: 12.5 } } }
        }
      }
    });
  }

  /* ---------- Count-up ---------- */
  function countUp() {
    var els = document.querySelectorAll(".stat-num[data-count]");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10);
        var start = performance.now(), dur = 1100;
        function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Copy BibTeX ---------- */
  function copyCite() {
    var btn = document.getElementById("copyCite");
    var pre = document.getElementById("bibtex");
    if (!btn || !pre) return;
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(pre.textContent).then(function () {
        var original = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = original; }, 1600);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillMapping();
    fillFiles();
    intentChart();
    fieldChart();
    countUp();
    copyCite();
  });
})();
