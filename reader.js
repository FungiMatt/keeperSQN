const fs = require('fs');
const os = require('os');
const osUtils = require('os-utils');
const si = require('systeminformation');
var mkdirp = require('mkdirp');

const bToGb = Math.pow(10, 9);

mkdirp(__dirname+'json', function (err) {
    if (err) console.error(err)
});

let path = os.platform() === 'win32' ? 'c:' : '/';

var iCPU = 0;
var cpuArray = [];
var linhaUso;

function tudo(){
  si.mem(function(mem){
    const memTotal = ((mem.total/bToGb).toFixed(2));
    const memUsada = ((mem.used/bToGb).toFixed(2));
    const memLivre = ((mem.free/bToGb).toFixed(2));

    console.log('\nMemória RAM:');
    console.log('Memória total = '+memTotal+'GB');
    console.log('Memória em uso = '+memUsada+'GB');
    console.log('Memória Livre = '+memLivre+'GB');

    let jsonMem = {
      memoria_total: memTotal,
      memoria_uso: memUsada,
      memoria_livre: memLivre,
    };

    let dataMem = JSON.stringify(jsonMem, null, 2);
    fs.writeFileSync('json/memoria.json', dataMem);

  });

  si.fsSize(function(disco){
    var i;
    var jsonArray = [];

    for (i=0;i<disco.length;i++){
      const hdd = disco[i].fs;
      const espacoTotal = ((disco[i].size/bToGb).toFixed(0));
      const espacoUso = ((disco[i].used/bToGb).toFixed(0));
      const percUso = ((disco[i].use).toFixed(0));
      const espacoDisp = (((disco[i].size/bToGb).toFixed(0))-((disco[i].used/bToGb).toFixed(0)));
      const percDisp = (100-percUso);

      jsonArray.push({
        disco_unidade: hdd,
        disco_espaco_total: espacoTotal,
        disco_espaco_usado: espacoUso,
        disco_espaco_disponivel: espacoDisp,
      });

      console.log('\nDisco '+hdd)
      if(isNaN(espacoTotal)){
        console.log('Informações de espaço indisponíveis');
      } else{
        console.log('Espaço total = '+espacoTotal+'GB');
        console.log('Espaço em uso = '+espacoUso+'GB'+' ('+percUso+'%)');
        console.log('Espaço disponível = '+espacoDisp+'GB'+' ('+percDisp+'%)');
      }
      let dataDisco = JSON.stringify(jsonArray, null, 2     );
      fs.writeFileSync('json/disco.json', dataDisco);
    }
  });

  osUtils.cpuUsage(function(cpuPerc){
    const usoCPU = ((cpuPerc*100).toFixed(0));
    const qtdCPU = osUtils.cpuCount()

    cpuArray[iCPU] = usoCPU;
    iCPU++;

    if(iCPU==11){
      iCPU=0;
    }

    console.log('\nA máquina possui '+qtdCPU+' núcleos')
    console.log('\nUso de CPU (%): '+usoCPU);

    let jsonCPU = {
      cpu_num_nucleos: qtdCPU,
      cpu_perc_uso_atual: usoCPU,
      cpu_perc_uso_linha_tempo: [cpuArray.toString()]
    };

    let dataCPU = JSON.stringify(jsonCPU, null, 2);
    fs.writeFileSync('json/cpu.json', dataCPU);
  });
};

setInterval(tudo, 5000);
