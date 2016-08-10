var currentMove = {};

//single-auto-steps//
var mode = 'single';
var auto;
var turno;
var steps;
$( document ).ready(function() {
	if(mode=='single') {
		auto = false;
		turno = false;
		steps = false
		$('#muovi').remove()
		$('#passo').remove()
	}
	if(mode=='auto') {
		auto = true;
		turno = true;
		steps = false
		$('#muovi').remove()
		$('#passo').remove()
	}
	if(mode=='steps') {
		auto = true;
		turno = false;
		steps = true
	}
	checkWindow()
	$( window ).resize(function() {
	  checkWindow();
	});
	var partita  = {};
	creaScacchiera(partita);
	disegnaScacchiera(partita);
	if(mode!='steps') {
		$( "body" ).on( "click",'.scacchiera div[class*="bianco"]', function() {
		  $('div').removeClass('highlight')
		  var a  = possibilita($( this ).attr('class'),$( this ).prevAll().length,partita);
		  var b  = possibilitaDiMangiare($( this ).attr('class'),$( this ).prevAll().length,partita);
		  if(a.length>0) {
		  	$( ".scacchiera" ).addClass('ricezione');
		  	currentMove.posizioneCorrente = $( this ).prevAll().length;
		  }
		  for (var i = a.length - 1; i >= 0; i--) {
		  	$('.casella').eq(a[i]).addClass('highlight')
		  };
		  for (var i = b.length - 1; i >= 0; i--) {
		  	//$('.casella').eq(b[i]).addClass('highlight2')
		  };
		  $('.scacchieraTemp').remove();
		  for (var i = a.length - 1; i >= 0; i--) {
		  	  simulazione = JSON.parse(JSON.stringify(partita));
			  simulaMuovi(simulazione,currentMove.posizioneCorrente,a[i])

			  if(controllaScacco(simulazione,'nero')) {
			  	// $('.scacchieraTemp').last().addClass('scacco')
			  	 $('.casella').eq(a[i]).removeClass('highlight')
			  }
		  };
		  //$('.scacchieraTemp').remove();
		});
		$( "body" ).on( "click",'.scacchiera.ricezione div[class*="highlight"]', function() {
			$( ".scacchiera" ).removeClass('ricezione');
		  	$('div').removeClass('highlight');
		  	currentMove.posizioneFinale = $( this ).prevAll().length;
		  	muovi(partita);
		  	//var scacco = controllaScacco(partita,'bianco')

		  	setTimeout(function(){  muoviI(partita); }, 500);
		});
	}
	if(steps || true) {
		$( "body" ).on( "click",'#passo', function() {
			muoviI(partita);
		});
		$( "body" ).on( "click",'#muovi', function() {
			muovi(partita);
			$('.scacchieraTemp').remove();
		});
	}
});
function checkWindow() {
	if(window.innerHeight<window.innerWidth)  $('body').addClass('landscape').removeClass('portrait')
	else $('body').addClass('portrait').removeClass('landscape')
}
function controllaScacco(partita,chi) {
		//disegnaScacchieraTemp(partita)
		var hisMove = []
		if(auto) {
			var achi = turno ? 'nero' : 'bianco';
		} else {
			var achi = chi;
		}
		// $.each($('.scacchieraTemp:last div[class*="'+achi+'"]'), function(index, val) {
		// 	hisMove.push({starting:$( this ).prevAll('.casella').length})
		// 	var a  = possibilita($( this ).attr('class'),$( this ).prevAll('.casella').length,partita);
		// 	var endings = [];
		// 	for (var i = a.length - 1; i >= 0; i--) {
		// 	  	endings.push(a[i])
		// 	  };
		// 	hisMove[hisMove.length-1].endings = endings;
		// });
		$.each(partita.caselle, function(index, val) {
			if(val.colore==achi) {
			hisMove.push({starting:index})
			var construzione = val.occupata+val.colore;
			var a  = possibilita(construzione,index,partita);
			var endings = [];
			for (var i = a.length - 1; i >= 0; i--) {
			  	endings.push(a[i])
			  };
			hisMove[hisMove.length-1].endings = endings;
			}
		});
		var arrayMosse = [];
		$.each(hisMove, function(index, val) {
			if(val.endings.length!=0) {
				arrayMosse.push(val)
			}
		});
		if(arrayMosse.length==0) {
			return alert('scacco matto')
		}
		var scacco = false;
		$.each(arrayMosse, function(index, val) {
			$.each(val.endings, function(index2, val2) {
					//$('.scacchieraTemp:last .casella').eq(val2).addClass('highlight2')
					//console.log(partita.caselle[val2].occupata)
					if(partita.caselle[val2].occupata=='re') {
						scacco = true;
					}
			});
		});
		//console.log('------')
		return scacco;
}
function muovi(partita) {
	var pezzo = partita.caselle[currentMove.posizioneCorrente].occupata;
	var colore = partita.caselle[currentMove.posizioneCorrente].colore;
	partita.caselle[currentMove.posizioneCorrente] = {colore:'no',occupata:'no'}
   	partita.caselle[currentMove.posizioneFinale] = {colore:colore,occupata:pezzo}
   	if(pezzo.indexOf('pedone')!=-1) {
   		if(colore=='bianco'){
   			if(currentMove.posizioneFinale<8) {
   				partita.caselle[currentMove.posizioneFinale] = {colore:colore,occupata:'regina'}
   			}
   		}
   		if(colore=='nero'){
   			if(currentMove.posizioneFinale>55) {
   				partita.caselle[currentMove.posizioneFinale] = {colore:colore,occupata:'regina'}
   			}
   		}
   	}
   	currentMove = {};
	disegnaScacchiera(partita)
}
function simulaMuovi(partita,from,to) {
	var pezzo = partita.caselle[from].occupata;
	var colore = partita.caselle[from].colore;
	partita.caselle[from] = {colore:'no',occupata:'no'}
   	partita.caselle[to] = {colore:colore,occupata:pezzo}
   	if(pezzo.indexOf('pedone')!=-1) {
   		if(colore=='bianco'){
   			if(to<8) {
   				partita.caselle[to] = {colore:colore,occupata:'regina'}
   			}
   		}
   		if(colore=='nero'){
   			if(to>55) {
   				partita.caselle[to] = {colore:colore,occupata:'regina'}
   			}
   		}
   	}
    //disegnaScacchieraTemp(partita)
}
function muoviI(partita) {
	var hisMove = []
	if(auto) {
		var achi = turno ? 'nero' : 'bianco';
		var avversario = turno ? 'bianco' : 'nero';
		turno = !turno;

	} else {
		var achi = 'nero';
		var avversario = 'bianco'
	}

	var hisMove = []
	var attack = [];
	var attackTemp = [];
	$.each(partita.caselle, function(index, val) {
		if(val.colore==achi) {
		hisMove.push({starting:index})
		var construzione = val.occupata+val.colore;
		var a  = possibilita(construzione,index,partita);
		var b  = possibilitaDiMangiare(construzione,index,partita);
		for (var i = b.length - 1; i >= 0; i--) {
		  	//$('.casella').eq(a[i]).addClass('highlight')
		  	if(attack.indexOf(b[i])==-1) {
		  		attack.push(b[i])
		  		attackTemp.push([b[i],1]);
		  	} else {
		  		$.each(attackTemp, function(index, val) {
		  			if(val[0]==b[i]) {
		  				val[1] = val[1]+1;
		  			}
		  		});
		  	}
		  };
		var endings = [];
		for (var i = a.length - 1; i >= 0; i--) {
		  	//$('.casella').eq(a[i]).addClass('highlight')
		  	endings.push(a[i])
		  };
		hisMove[hisMove.length-1].endings = endings;
		}
	});
	//console.log(attack)
	for (var i = attack.length - 1; i >= 0; i--) {
		$('.casella').eq(attack[i]).addClass('highlight2')
	};

	var enemyattack = [];
	$.each(partita.caselle, function(index, val) {
		if(val.colore==avversario) {
		var construzione = val.occupata+val.colore;
		var b  = possibilitaDiMangiare(construzione,index,partita);
		for (var i = b.length - 1; i >= 0; i--) {
		  	if(enemyattack.indexOf(b[i])==-1)
		  		enemyattack.push(b[i])
		  };
		}
	});
	for (var i = enemyattack.length - 1; i >= 0; i--) {
		$('.casella').eq(enemyattack[i]).addClass('highlight3')
	};
	//console.log(enemyattack)
	var arrayMosse = [];
	$.each(hisMove, function(index, val) {
		if(val.endings.length!=0) {
			arrayMosse.push(val)
		}
	});
	if(arrayMosse.length==0) {
		return alert('fine')
	}
	var darimuovere = []
	var simulazione;
	$.each(arrayMosse, function(index, val) {
		$.each(val.endings, function(index2, val2) {
			simulazione = JSON.parse(JSON.stringify(partita));
			simulaMuovi(simulazione,val.starting,val2);
			//disegnaScacchieraTemp(simulazione);
			if(controllaScacco(simulazione,avversario)) {
	  	 		darimuovere.push([index,index2])

	 		}
		});
	});
	//$('.scacchieraTemp').remove();
	$.each(darimuovere, function(index, val) {
		arrayMosse[val[0]].endings[val[1]] = -1;
	});
	var arrayMosse2 = [];
	$.each(arrayMosse, function(index, val) {
		arrayMosse2.push({starting:val.starting,endings:[]})
		$.each(val.endings, function(index2, val2) {
			if(val2!=-1)
			arrayMosse2[arrayMosse2.length-1].endings.push(val2);
		});
	});
	arrayMosse = arrayMosse2;
	var arrayMosse2 = [];
	$.each(arrayMosse, function(index, val) {
		if(val.endings.length!=0) {
			arrayMosse2.push({starting:val.starting,endings:val.endings})
		}
	});
	arrayMosse = arrayMosse2;
	$.each(arrayMosse, function(index, val) {
		$.each(val.endings, function(index2, val2) {
			$('.casella').eq(val2).addClass('highlight')
		});
	});
	if(arrayMosse.length==0) {
		if(auto) {
			if(turno) alert('vince il nero')
			else alert('vince il bianco')
		}
		else alert('hai vinto')
	}  else {
		faiCalcoliComplicatissimi(arrayMosse,partita,attack,enemyattack);
		if(!steps) muovi(partita)
		if(auto) {
			if(!steps) setTimeout(function(){  muoviI(partita); }, 0);
		}
	}
}
function faiCalcoliComplicatissimi(arrayMosse,partita,attack,enemyattack) {
	var conto = 0;
	$.each(arrayMosse, function(index, val) {
		conto += val.endings.length
	});
	console.log(conto+' mosse possibili')
	var tutte = [];// provaleTutte(arrayMosse,partita);
	if(tutte[1]!=undefined) {
		//console.log('conviene: da '+tutte[1][0]+' a '+tutte[1][1])
		currentMove.posizioneCorrente = tutte[1][0];
		currentMove.posizioneFinale = tutte[1][1];
	} else {

		//besaz AI
		var coloreCorrente = partita.caselle[arrayMosse[0].starting].colore;
		var statoCorrente = dammiStato(coloreCorrente,partita,arrayMosse);
		console.log(statoCorrente)
		// console.log('-------')
		// console.log('le mosse: ')
		var sit = provaleTutte(arrayMosse,partita)


		var attaccateEscoperte = [];
		$.each(sit, function(index, val) {
			 	$.each(val.pedineAttaccate, function(index2, val2) {
			 		// console.log('attaccate:'); console.log(val2)
			 		// console.log('scoperte:'); console.log(val.pedineScoperte)
			 		 if(val.pedineScoperte.indexOf(val2)!=-1) {
			 		 	 //console.log('in posizione '+val2+' attaccata e scoperta, pessima mossa');
			 		 	 attaccateEscoperte.push(index)
			 		 }
			 	});
		});
		// console.log('--------------------------------');
		// console.log('mosse da non fare?');
		if(attaccateEscoperte.length>0) {
			console.log('attaccateEscoperte')
			var lenuoveMosse = [];
			if(attaccateEscoperte.length<sit.length) {
				$.each(sit, function(index, val) {
					if(attaccateEscoperte.indexOf(index)==-1) {
						lenuoveMosse.push(val);
					} else 	console.log(val)
				});
				// console.log(sit)//sit = lenuoveMosse;
				 console.log('elimino '+(sit.length-lenuoveMosse.length)+' mosse dannose')
				sit = lenuoveMosse;
			}
			//


		}

		var mosseInCuiMangio = [];
		//console.log(sit)
		$.each(sit, function(index, val) {
			 //console.log(val)
			 if(statoCorrente.avversario>val.avversario) {
			 	//console.log('posso mangiare in posizione: '+val.lamossa[1]);
			 	mosseInCuiMangio.push(index)
			 }

		});
		var scoperte = []
		$.each(mosseInCuiMangio, function(index, val) {
			  //console.log(sit[val]);
			 if(enemyattack.indexOf(sit[val].lamossa[1])!=-1) {
			 	// console.log('è coperta, valori:')
			 	// console.log('con il: '+partita.caselle[sit[val].lamossa[0]].occupata+' '+partita.caselle[sit[val].lamossa[0]].colore+' e vale: '+convertiInValore(partita.caselle[sit[val].lamossa[0]].occupata));
			 	// console.log('mangio il: '+partita.caselle[sit[val].lamossa[1]].occupata+' '+partita.caselle[sit[val].lamossa[1]].colore+' e vale: '+convertiInValore(partita.caselle[sit[val].lamossa[1]].occupata));
			 	// console.log('differenza: '+Math.abs(convertiInValore(partita.caselle[sit[val].lamossa[1]].occupata)-convertiInValore(partita.caselle[sit[val].lamossa[0]].occupata)))
			 	if(convertiInValore(partita.caselle[sit[val].lamossa[1]].occupata)>=convertiInValore(partita.caselle[sit[val].lamossa[0]].occupata)+3) {
			 			//console.log('mangio lo stesso')
			 			scoperte.push(val)
			 	}
			 } else {
			 	// console.log('è scoperta, valori:')
			 	// console.log('con il: '+partita.caselle[sit[val].lamossa[0]].occupata+' '+partita.caselle[sit[val].lamossa[0]].colore+' e vale: '+convertiInValore(partita.caselle[sit[val].lamossa[0]].occupata));
			 	// console.log('mangio il: '+partita.caselle[sit[val].lamossa[1]].occupata+' '+partita.caselle[sit[val].lamossa[1]].colore+' e vale: '+convertiInValore(partita.caselle[sit[val].lamossa[1]].occupata));

			 	scoperte.push(val)
			 }
		});
		if(scoperte.length>0) {
			var byDate = scoperte.slice(0);
			byDate.sort(function(a,b) {
				return a.avversario - b.avversario; //mangiare quello che ha più valore
			    //return sit[a].pedineScoperte.length - sit[b].pedineScoperte.length;
			});
			console.log('mangio la pedina scoperta con più valore')
			currentMove.posizioneCorrente = sit[byDate[0]].lamossa[0];
			currentMove.posizioneFinale = sit[byDate[0]].lamossa[1];
		}
		else {

				//console.log(sit)
				var byDate = sit.slice(0);
				byDate.sort(function(a,b) {
				    return a.pedineAttaccate.length - b.pedineAttaccate.length;
				});
				$.each(byDate, function(index, val) {
					 	console.log(val)
				});
				var byDue = [];
				if(byDate.length>0) {
					$.each(byDate, function(index, val) {
						 if(val.pedineAttaccate.length==byDate[0].pedineAttaccate.length) {
						 	console.log(index)
						 	byDue.push(val)
						 }
					});
					byDate = byDue.slice(0);
					byDate.sort(function(a,b) {
				    return a.pedineScoperte.length - b.pedineScoperte.length;
				});
				}


				currentMove.posizioneCorrente = byDate[0].lamossa[0];
				currentMove.posizioneFinale = byDate[0].lamossa[1];
				console.log('muovo per proteggere')
				// var randomInt = getRandomInt(0,arrayMosse.length-1);
				// var mossaRandom = arrayMosse[randomInt]
				// currentMove.posizioneCorrente = mossaRandom.starting;
				// var randomInt2 = getRandomInt(0,mossaRandom.endings.length-1);
				// currentMove.posizioneFinale = mossaRandom.endings[randomInt2];
				// console.log('mossa a caso: da '+currentMove.posizioneCorrente+' a '+currentMove.posizioneFinale)
			}





	}
}
function provaleTutte(arrayMosse,partita,attack,enemyattack) {
	var coloreCorrente = partita.caselle[arrayMosse[0].starting].colore;
	var coloreAvversario = coloreCorrente=='bianco' ? 'nero' : 'bianco';
	// console.log('stato corrente:')
	// console.log(dammiStato(coloreCorrente,partita));
	// console.log('-------')
	var simulazione = [];
	var minimo = dammiStato(coloreCorrente,partita,arrayMosse).avversario;
	var lamossa;
	var situazioni = [];
	$.each(arrayMosse, function(index, val) {
		$.each(val.endings, function(index2, val2) {
			simulazione = JSON.parse(JSON.stringify(partita));
			simulaMuovi(simulazione,val.starting,val2)
			lamossa = [val.starting,val2]
			situazioni.push(dammiStato(coloreCorrente,simulazione,arrayMosse,lamossa))
			//console.log(dammiStato(coloreCorrente,simulazione,arrayMosse,attack,enemyattack,lamossa))
		});
	});
	return(situazioni)
}
function dammiStato(coloreCorrente,partita,arrayMosse,lamossa) {
	coloreCorrente;
	var coloreAvversario = coloreCorrente=='bianco' ? 'nero' : 'bianco';
	var statoattuale1 = 0;
	var statoattuale2 = 0;
	var pedineAttaccate = [];
	var pedineScoperte = [];

	var attack = [];

	$.each(partita.caselle, function(index, val) {
		if(val.colore==coloreCorrente) {
		var construzione = val.occupata+val.colore;
		var a  = possibilita(construzione,index,partita);
		var b  = possibilitaDiMangiare(construzione,index,partita);
		for (var i = b.length - 1; i >= 0; i--) {
		  	//$('.casella').eq(a[i]).addClass('highlight')
		  	if(attack.indexOf(b[i])==-1) {
		  		attack.push(b[i])
		  	}
		  };

		}
	});
	var enemyattack = [];
	$.each(partita.caselle, function(index, val) {
		if(val.colore==coloreAvversario) {
		var construzione = val.occupata+val.colore;
		var b  = possibilitaDiMangiare(construzione,index,partita);
		for (var i = b.length - 1; i >= 0; i--) {
		  	if(enemyattack.indexOf(b[i])==-1)
		  		enemyattack.push(b[i])
		  };
		}
	});

	$.each(partita.caselle, function(index, val) {
		if(val.colore==coloreCorrente) {
			if(enemyattack.indexOf(index)!=-1) pedineAttaccate.push(index)
			if(attack.indexOf(index)==-1) pedineScoperte.push(index)
			if(val.occupata=='pedone') statoattuale1=statoattuale1+1;
			if(val.occupata=='cavallo' || val.occupata=='alfiere') statoattuale1=statoattuale1+3;
			if(val.occupata=='torre') statoattuale1=statoattuale1+5;
			if(val.occupata=='regina') statoattuale1=statoattuale1+9;
		}
		else if(val.colore==coloreAvversario) {
			if(val.occupata=='pedone') statoattuale2=statoattuale2+1;
			if(val.occupata=='cavallo' || val.occupata=='alfiere') statoattuale2=statoattuale2+3;
			if(val.occupata=='torre') statoattuale2=statoattuale2+5;
			if(val.occupata=='regina') statoattuale2=statoattuale2+9;
		}
	});
	return {corrente:statoattuale1,avversario:statoattuale2,pedineAttaccate:pedineAttaccate,pedineScoperte:pedineScoperte,lamossa:lamossa!=undefined ? lamossa : 'stato corrente'};
}
function convertiInValore(pedina) {
	if(pedina=='pedone') return 1;
	if(pedina=='cavallo' || pedina=='alfiere') return 3;
	if(pedina=='torre') return 5;
	if(pedina=='regina') return 9;
}
function creaScacchiera(partita) {
	$('body').append("<div class='scacchiera'></div>");
    partita.caselle = []
	for (var i = 8; i > 0; i--) {
		 for (var il = 8; il > 0; il--) {
		 	if(i==2)
    		partita.caselle.push({colore:'bianco',occupata:'pedone'})
    		else if(i==7)
    		partita.caselle.push({colore:'nero',occupata:'pedone'})
    		else if(i==8 && (il == 2 || il == 7))
    		partita.caselle.push({colore:'nero',occupata:'cavallo'})
    		else if(i==1 && (il == 2 || il == 7))
    		partita.caselle.push({colore:'bianco',occupata:'cavallo'})
    		else if(i==8 && (il == 3 || il == 6))
    		partita.caselle.push({colore:'nero',occupata:'alfiere'})
    		else if(i==1 && (il == 3 || il == 6))
    		partita.caselle.push({colore:'bianco',occupata:'alfiere'})
    		else if(i==8 && (il == 1 || il == 8))
    		partita.caselle.push({colore:'nero',occupata:'torre'})
    		else if(i==1 && (il == 1 || il == 8))
    		partita.caselle.push({colore:'bianco',occupata:'torre'})
    		else if(i==8 && il == 5)
    		partita.caselle.push({colore:'nero',occupata:'re'})
    		else if(i==1 && il == 4)
    		partita.caselle.push({colore:'bianco',occupata:'re'})
    		else if(i==8 && il == 4)
    		partita.caselle.push({colore:'nero',occupata:'regina'})
    		else if(i==1 && il == 5)
    		partita.caselle.push({colore:'bianco',occupata:'regina'})
    		else
    		partita.caselle.push({colore:'no',occupata:'no'})
    	};
	};
}
function disegnaScacchiera(partita) {
	$('.scacchiera').html('');
	$.each(partita.caselle, function(index, val) {
		 var tipo = 'vuoto'
		 if(val.occupata!='no') tipo = val.occupata+val.colore
		 if(steps)
		 $('.scacchiera').append("<div class='casella "+tipo+"'><div>"+index+"</div></div>")
		 else
		 $('.scacchiera').append("<div class='casella "+tipo+"'></div>")
	});
}
function disegnaScacchieraTemp(partita) {
	$('body').append('<div class="scacchieraTemp"></div>');
	$.each(partita.caselle, function(index, val) {
		 var tipo = 'vuoto'
		 if(val.occupata!='no') tipo = val.occupata+val.colore
		 $('.scacchieraTemp').last().append("<div class='casella "+tipo+"'></div>")
	});
}
function possibilita(tipo,posizione,partita) {
	var possibilita = [];
	var suogiu;
	var avversario;
	var corrente;
	var posizioneoriginale = posizione;
	tipo.indexOf('bianco')==-1 ? suogiu=-1 : suogiu=1;
	tipo.indexOf('bianco')==-1 ? avversario='bianco' : avversario='nero';
	avversario=='nero'  ? corrente='bianco' : corrente='nero';
	if(tipo.indexOf('pedone')!=-1) {
		//pedone muove
		if(partita.caselle[posizione-(8*suogiu)].occupata=='no')
		possibilita.push(posizione-(8*suogiu))
		if(corrente=='bianco' && posizione<56 && posizione>47)
		if(partita.caselle[posizione-(16)].occupata=='no')
		if(partita.caselle[posizione-(8)].occupata=='no')
		possibilita.push(posizione-(16))
		if(corrente=='nero' && posizione<16 && posizione>7)
		if(partita.caselle[posizione+(16)].occupata=='no')
		if(partita.caselle[posizione+(8)].occupata=='no')
		possibilita.push(posizione+(16))
		//pedone mangia sx
		if(posizione%8!=0)
		if(partita.caselle[posizione-(8*suogiu)-1].occupata!='no' && partita.caselle[posizione-(8*suogiu)-1].colore==avversario)
		possibilita.push(posizione-(8*suogiu)-1)
		//pedone mangia dx
		if(posizione%8!=7)
		if(partita.caselle[posizione-(8*suogiu)+1].occupata!='no' && partita.caselle[posizione-(8*suogiu)+1].colore==avversario)
		possibilita.push(posizione-(8*suogiu)+1)
	}
	if(tipo.indexOf('cavallo')!=-1) {
		//cavallo muove
		if(posizione%8!=7 && posizione>15)
		if(partita.caselle[posizione-(16)+1].colore!=corrente)
		possibilita.push(posizione-(16)+1)
		if(posizione%8!=0 && posizione>15)
		if(partita.caselle[posizione-(16)-1].colore!=corrente)
		possibilita.push(posizione-(16)-1)
		if(posizione%8!=7 && posizione<48)
		if(partita.caselle[posizione-(-16)+1].colore!=corrente)
		possibilita.push(posizione-(-16)+1)
		if(posizione%8!=0 && posizione<48)
		if(partita.caselle[posizione-(-16)-1].colore!=corrente)
		possibilita.push(posizione-(-16)-1)
		if(posizione%8>1 && posizione<56)
		if(partita.caselle[posizione-(-8)-2].colore!=corrente)
		possibilita.push(posizione-(-8)-2)
		if(posizione%8>1 && posizione>7)
		if(partita.caselle[posizione-(8)-2].colore!=corrente)
		possibilita.push(posizione-(8)-2)
		if(posizione%8<6 && posizione<56)
		if(partita.caselle[posizione-(-8)+2].colore!=corrente)
		possibilita.push(posizione-(-8)+2)
		if(posizione%8<6 && posizione>7)
		if(partita.caselle[posizione-(8)+2].colore!=corrente)
		possibilita.push(posizione-(8)+2)
	}
	if(tipo.indexOf('alfiere')!=-1 || tipo.indexOf('regina')!=-1) {
		var temp;
		//alto sinistra
		if(posizione%8!=0 && posizione>7)
		if(partita.caselle[posizione-(8)-1].colore!=corrente) {
			temp = partita.caselle[posizione-(8)-1].colore;
			possibilita.push(posizione-(8)-1);
			var nuovaposizione = (posizione-(8)-1);
			if(temp=='no')
			if(nuovaposizione%8!=0 && nuovaposizione>7) {
				if(partita.caselle[nuovaposizione-(8)-1].colore!=corrente) {
					temp = partita.caselle[nuovaposizione-(8)-1].colore;
					possibilita.push(nuovaposizione-(8)-1);
					nuovaposizione = (nuovaposizione-(8)-1);
					if(temp=='no')
					if(nuovaposizione%8!=0 && nuovaposizione>7) {
						if(partita.caselle[nuovaposizione-(8)-1].colore!=corrente) {
							temp = partita.caselle[nuovaposizione-(8)-1].colore;
							possibilita.push(nuovaposizione-(8)-1);
							nuovaposizione = (nuovaposizione-(8)-1);
							if(temp=='no')
							if(nuovaposizione%8!=0 && nuovaposizione>7) {
								if(partita.caselle[nuovaposizione-(8)-1].colore!=corrente) {
									temp = partita.caselle[nuovaposizione-(8)-1].colore;
									possibilita.push(nuovaposizione-(8)-1);
									nuovaposizione = (nuovaposizione-(8)-1);
									if(temp=='no')
									if(nuovaposizione%8!=0 && nuovaposizione>7) {
										if(partita.caselle[nuovaposizione-(8)-1].colore!=corrente) {
											temp = partita.caselle[nuovaposizione-(8)-1].colore;
											possibilita.push(nuovaposizione-(8)-1);
											nuovaposizione = (nuovaposizione-(8)-1);
											if(temp=='no')
											if(nuovaposizione%8!=0 && nuovaposizione>7) {
												if(partita.caselle[nuovaposizione-(8)-1].colore!=corrente) {
													temp = partita.caselle[nuovaposizione-(8)-1].colore;
													possibilita.push(nuovaposizione-(8)-1);
													nuovaposizione = (nuovaposizione-(8)-1);
													if(temp=='no')
													if(nuovaposizione%8!=0 && nuovaposizione>7) {
														if(partita.caselle[nuovaposizione-(8)-1].colore!=corrente) {
															possibilita.push(nuovaposizione-(8)-1);
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		//alto destra
		posizione = posizioneoriginale;
		if(posizione%8!=7 && posizione>7)
		if(partita.caselle[posizione-(8)+1].colore!=corrente) {
			temp = partita.caselle[posizione-(8)+1].colore;
			possibilita.push(posizione-(8)+1)
			posizione = (posizione-(8)+1);
			if(temp=='no')
			if(posizione%8!=7 && posizione>7) {
				if(partita.caselle[posizione-(8)+1].colore!=corrente) {
					temp = partita.caselle[posizione-(8)+1].colore;
					possibilita.push(posizione-(8)+1);
					posizione = (posizione-(8)+1);
					if(temp=='no')
					if(posizione%8!=7 && posizione>7) {
						if(partita.caselle[posizione-(8)+1].colore!=corrente) {
							temp = partita.caselle[posizione-(8)+1].colore;
							possibilita.push(posizione-(8)+1);
							posizione = (posizione-(8)+1);
							if(temp=='no')
							if(posizione%8!=7 && posizione>7) {
								if(partita.caselle[posizione-(8)+1].colore!=corrente) {
									temp = partita.caselle[posizione-(8)+1].colore;
									possibilita.push(posizione-(8)+1);
									posizione = (posizione-(8)+1);
									if(temp=='no')
									if(posizione%8!=7 && posizione>7) {
										if(partita.caselle[posizione-(8)+1].colore!=corrente) {
											temp = partita.caselle[posizione-(8)+1].colore;
											possibilita.push(posizione-(8)+1);
											posizione = (posizione-(8)+1);
											if(temp=='no')
											if(posizione%8!=7 && posizione>7) {
												if(partita.caselle[posizione-(8)+1].colore!=corrente) {
													temp = partita.caselle[posizione-(8)+1].colore;
													possibilita.push(posizione-(8)+1);
													posizione = (posizione-(8)+1);
													if(temp=='no')
													if(posizione%8!=7 && posizione>7) {
														if(partita.caselle[posizione-(8)+1].colore!=corrente) {
															possibilita.push(posizione-(8)+1);
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		//basso sinistra
		posizione = posizioneoriginale;
		if(posizione%8!=0 && posizione<56) {
			if(partita.caselle[posizione+7].colore!=corrente) {
				temp = partita.caselle[posizione+7].colore;
				possibilita.push(posizione+7);
				posizione = posizione+7;
				if(temp=='no') {
					if(posizione%8!=0 && posizione<56) {
						if(partita.caselle[posizione+7].colore!=corrente) {
							temp = partita.caselle[posizione+7].colore;
							possibilita.push(posizione+7);
							posizione = posizione+7;
							if(temp=='no') {
								if(posizione%8!=0 && posizione<56) {
									if(partita.caselle[posizione+7].colore!=corrente) {
										temp = partita.caselle[posizione+7].colore;
										possibilita.push(posizione+7);
										posizione = posizione+7;
										if(temp=='no') {
											if(posizione%8!=0 && posizione<56) {
												if(partita.caselle[posizione+7].colore!=corrente) {
													temp = partita.caselle[posizione+7].colore;
													possibilita.push(posizione+7);
													posizione = posizione+7;
													if(temp=='no') {
														if(posizione%8!=0 && posizione<56) {
															if(partita.caselle[posizione+7].colore!=corrente) {
																temp = partita.caselle[posizione+7].colore;
																possibilita.push(posizione+7);
																posizione = posizione+7;
																if(temp=='no') {
																	if(posizione%8!=0 && posizione<56) {
																		if(partita.caselle[posizione+7].colore!=corrente) {
																			temp = partita.caselle[posizione+7].colore;
																			possibilita.push(posizione+7);
																			posizione = posizione+7;
																			if(temp=='no') {
																				if(posizione%8!=0 && posizione<56) {
																					if(partita.caselle[posizione+7].colore!=corrente) {
																						possibilita.push(posizione+7);
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		//basso destra
		posizione = posizioneoriginale;
		if(posizione%8!=7 && posizione<56) {
			if(partita.caselle[posizione+9].colore!=corrente) {
				temp = partita.caselle[posizione+9].colore;
				possibilita.push(posizione+9);
				posizione = posizione+9;
				if(temp=='no') {
					if(posizione%8!=7 && posizione<56) {
						if(partita.caselle[posizione+9].colore!=corrente) {
							temp = partita.caselle[posizione+9].colore;
							possibilita.push(posizione+9);
							posizione = posizione+9;
							if(temp=='no') {
								if(posizione%8!=7 && posizione<56) {
									if(partita.caselle[posizione+9].colore!=corrente) {
										temp = partita.caselle[posizione+9].colore;
										possibilita.push(posizione+9);
										posizione = posizione+9;
										if(temp=='no') {
											if(posizione%8!=7 && posizione<56) {
												if(partita.caselle[posizione+9].colore!=corrente) {
													temp = partita.caselle[posizione+9].colore;
													possibilita.push(posizione+9);
													posizione = posizione+9;
													if(temp=='no') {
														if(posizione%8!=7 && posizione<56) {
															if(partita.caselle[posizione+9].colore!=corrente) {
																temp = partita.caselle[posizione+9].colore;
																possibilita.push(posizione+9);
																posizione = posizione+9;
																if(temp=='no') {
																	if(posizione%8!=7 && posizione<56) {
																		if(partita.caselle[posizione+9].colore!=corrente) {
																			temp = partita.caselle[posizione+9].colore;
																			possibilita.push(posizione+9);
																			posizione = posizione+9;
																			if(temp=='no') {
																				if(posizione%8!=7 && posizione<56) {
																					if(partita.caselle[posizione+9].colore!=corrente) {
																						possibilita.push(posizione+9);
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if(tipo.indexOf('torre')!=-1 || tipo.indexOf('regina')!=-1) {
		var temp;
		//alto
		posizione = posizioneoriginale;
		if(posizione>7) {
			if(partita.caselle[posizione-(8)].colore!=corrente) {
				temp = partita.caselle[posizione-(8)].colore;
				possibilita.push(posizione-(8));
				posizione = (posizione-(8));
				if(temp=='no') {
					if(posizione>7) {
						if(partita.caselle[posizione-(8)].colore!=corrente) {
							temp = partita.caselle[posizione-(8)].colore;
							possibilita.push(posizione-(8));
							posizione = (posizione-(8));
							if(temp=='no') {
								if(posizione>7) {
									if(partita.caselle[posizione-(8)].colore!=corrente) {
										temp = partita.caselle[posizione-(8)].colore;
										possibilita.push(posizione-(8));
										posizione = (posizione-(8));
										if(temp=='no') {
											if(posizione>7) {
												if(partita.caselle[posizione-(8)].colore!=corrente) {
													temp = partita.caselle[posizione-(8)].colore;
													possibilita.push(posizione-(8));
													posizione = (posizione-(8));
													if(temp=='no') {
														if(posizione>7) {
															if(partita.caselle[posizione-(8)].colore!=corrente) {
																temp = partita.caselle[posizione-(8)].colore;
																possibilita.push(posizione-(8));
																posizione = (posizione-(8));
																if(temp=='no') {
																	if(posizione>7) {
																		if(partita.caselle[posizione-(8)].colore!=corrente) {
																			temp = partita.caselle[posizione-(8)].colore;
																			possibilita.push(posizione-(8));
																			posizione = (posizione-(8));
																			if(temp=='no') {
																				if(posizione>7) {
																					if(partita.caselle[posizione-(8)].colore!=corrente) {
																						possibilita.push(posizione-(8));
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		//basso
		posizione = posizioneoriginale;
		if(posizione<56) {
			if(partita.caselle[posizione+(8)].colore!=corrente) {
				temp = partita.caselle[posizione+(8)].colore;
				possibilita.push(posizione+(8));
				posizione = (posizione+(8));
				if(temp=='no') {
					if(posizione<56) {
						if(partita.caselle[posizione+(8)].colore!=corrente) {
							temp = partita.caselle[posizione+(8)].colore;
							possibilita.push(posizione+(8));
							posizione = (posizione+(8));
							if(temp=='no') {
								if(posizione<56) {
									if(partita.caselle[posizione+(8)].colore!=corrente) {
										temp = partita.caselle[posizione+(8)].colore;
										possibilita.push(posizione+(8));
										posizione = (posizione+(8));
										if(temp=='no') {
											if(posizione<56) {
												if(partita.caselle[posizione+(8)].colore!=corrente) {
													temp = partita.caselle[posizione+(8)].colore;
													possibilita.push(posizione+(8));
													posizione = (posizione+(8));
													if(temp=='no') {
														if(posizione<56) {
															if(partita.caselle[posizione+(8)].colore!=corrente) {
																temp = partita.caselle[posizione+(8)].colore;
																possibilita.push(posizione+(8));
																posizione = (posizione+(8));
																if(temp=='no') {
																	if(posizione<56) {
																		if(partita.caselle[posizione+(8)].colore!=corrente) {
																			temp = partita.caselle[posizione+(8)].colore;
																			possibilita.push(posizione+(8));
																			posizione = (posizione+(8));
																			if(temp=='no') {
																				if(posizione<56) {
																					if(partita.caselle[posizione+(8)].colore!=corrente) {
																						possibilita.push(posizione+(8));
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		//destra
		posizione = posizioneoriginale;
		if(posizione%8!=7) {
			if(partita.caselle[posizione+(1)].colore!=corrente) {
				temp = partita.caselle[posizione+(1)].colore;
				possibilita.push(posizione+(1));
				posizione = (posizione+(1));
				if(temp=='no') {
					if(posizione%8!=7) {
						if(partita.caselle[posizione+1].colore!=corrente) {
							temp = partita.caselle[posizione+1].colore;
							possibilita.push(posizione+1);
							posizione = (posizione+1);
							if(temp=='no') {
								if(posizione%8!=7) {
									if(partita.caselle[posizione+1].colore!=corrente) {
										temp = partita.caselle[posizione+1].colore;
										possibilita.push(posizione+1);
										posizione = (posizione+1);
										if(temp=='no') {
											if(posizione%8!=7) {
												if(partita.caselle[posizione+1].colore!=corrente) {
													temp = partita.caselle[posizione+1].colore;
													possibilita.push(posizione+1);
													posizione = (posizione+1);
													if(temp=='no') {
														if(posizione%8!=7) {
															if(partita.caselle[posizione+1].colore!=corrente) {
																temp = partita.caselle[posizione+1].colore;
																possibilita.push(posizione+1);
																posizione = (posizione+1);
																if(temp=='no') {
																	if(posizione%8!=7) {
																		if(partita.caselle[posizione+1].colore!=corrente) {
																			temp = partita.caselle[posizione+1].colore;
																			possibilita.push(posizione+1);
																			posizione = (posizione+1);
																			if(temp=='no') {
																				if(posizione%8!=7) {
																					if(partita.caselle[posizione+1].colore!=corrente) {
																						possibilita.push(posizione+1);
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		//sinistra
		posizione = posizioneoriginale;
		if(posizione%8!=0) {
			if(partita.caselle[posizione-(1)].colore!=corrente) {
				temp = partita.caselle[posizione-(1)].colore;
				possibilita.push(posizione-(1));
				posizione = (posizione-(1));
				if(temp=='no') {
					if(posizione%8!=0) {
						if(partita.caselle[posizione-1].colore!=corrente) {
							temp = partita.caselle[posizione-1].colore;
							possibilita.push(posizione-1);
							posizione = (posizione-1);
							if(temp=='no') {
								if(posizione%8!=0) {
									if(partita.caselle[posizione-1].colore!=corrente) {
										temp = partita.caselle[posizione-1].colore;
										possibilita.push(posizione-1);
										posizione = (posizione-1);
										if(temp=='no') {
											if(posizione%8!=0) {
												if(partita.caselle[posizione-1].colore!=corrente) {
													temp = partita.caselle[posizione-1].colore;
													possibilita.push(posizione-1);
													posizione = (posizione-1);
													if(temp=='no') {
														if(posizione%8!=0) {
															if(partita.caselle[posizione-1].colore!=corrente) {
																temp = partita.caselle[posizione-1].colore;
																possibilita.push(posizione-1);
																posizione = (posizione-1);
																if(temp=='no') {
																	if(posizione%8!=0) {
																		if(partita.caselle[posizione-1].colore!=corrente) {
																			temp = partita.caselle[posizione-1].colore;
																			possibilita.push(posizione-1);
																			posizione = (posizione-1);
																			if(temp=='no') {
																				if(posizione%8!=0) {
																					if(partita.caselle[posizione-1].colore!=corrente) {
																						possibilita.push(posizione-1);
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if(tipo=='rebianco' || tipo=='renero' || tipo.indexOf(' rebianco')!=-1 || tipo.indexOf(' renero')!=-1) {
		posizione = posizioneoriginale;
		if(posizione>7) {
			if(partita.caselle[posizione-(8)].colore!=corrente) {
				possibilita.push(posizione-(8))
			}
		}
		if(posizione<56) {
			if(partita.caselle[posizione+(8)].colore!=corrente) {
				possibilita.push(posizione+(8))
			}
		}
		if(posizione%8!=0) {
			if(partita.caselle[posizione-(1)].colore!=corrente) {
				possibilita.push(posizione-(1))
			}
		}
		if(posizione%8!=7) {
			if(partita.caselle[posizione+(1)].colore!=corrente) {
				possibilita.push(posizione+(1))
			}
		}
		if(posizione%8!=7 && posizione>7) {
			if(partita.caselle[posizione-(7)].colore!=corrente) {
				possibilita.push(posizione-(7))
			}
		}
		if(posizione%8!=0 && posizione>7) {
			if(partita.caselle[posizione-(9)].colore!=corrente) {
				possibilita.push(posizione-(9))
			}
		}
		if(posizione%8!=0 && posizione<56) {
			if(partita.caselle[posizione+(7)].colore!=corrente) {
				possibilita.push(posizione+(7))
			}
		}
		if(posizione%8!=7 && posizione<56) {
			if(partita.caselle[posizione+(9)].colore!=corrente) {
				possibilita.push(posizione+(9))
			}
		}
	}
	return possibilita;
}
function possibilitaDiMangiare(tipo,posizione,partita) {
	var possibilita = [];
	var suogiu;
	var avversario;
	var corrente;
	var posizioneoriginale = posizione;
	tipo.indexOf('bianco')==-1 ? suogiu=-1 : suogiu=1;
	tipo.indexOf('bianco')==-1 ? avversario='bianco' : avversario='nero';
	avversario=='nero'  ? corrente='bianco' : corrente='nero';
	if(tipo.indexOf('pedone')!=-1) {
		//pedone mangia sx
		if(posizione%8!=0)
		possibilita.push(posizione-(8*suogiu)-1)
		//pedone mangia dx
		if(posizione%8!=7)
		possibilita.push(posizione-(8*suogiu)+1)
	}
	if(tipo.indexOf('cavallo')!=-1) {
		//cavallo muove
		if(posizione%8!=7 && posizione>15)
		possibilita.push(posizione-(16)+1)
		if(posizione%8!=0 && posizione>15)
		possibilita.push(posizione-(16)-1)
		if(posizione%8!=7 && posizione<48)
		possibilita.push(posizione-(-16)+1)
		if(posizione%8!=0 && posizione<48)
		possibilita.push(posizione-(-16)-1)
		if(posizione%8>1 && posizione<56)
		possibilita.push(posizione-(-8)-2)
		if(posizione%8>1 && posizione>7)
		possibilita.push(posizione-(8)-2)
		if(posizione%8<6 && posizione<56)
		possibilita.push(posizione-(-8)+2)
		if(posizione%8<6 && posizione>7)
		possibilita.push(posizione-(8)+2)
	}
	if(tipo.indexOf('alfiere')!=-1 || tipo.indexOf('regina')!=-1) {
		var temp;
		//alto sinistra
		if(posizione%8!=0 && posizione>7){
				temp = partita.caselle[posizione-(8)-1].colore;
				possibilita.push(posizione-(8)-1);
				var nuovaposizione = (posizione-(8)-1);
				if(temp=='no')
				if(nuovaposizione%8!=0 && nuovaposizione>7) {
						temp = partita.caselle[nuovaposizione-(8)-1].colore;
						possibilita.push(nuovaposizione-(8)-1);
						nuovaposizione = (nuovaposizione-(8)-1);
						if(temp=='no')
						if(nuovaposizione%8!=0 && nuovaposizione>7) {
								temp = partita.caselle[nuovaposizione-(8)-1].colore;
								possibilita.push(nuovaposizione-(8)-1);
								nuovaposizione = (nuovaposizione-(8)-1);
								if(temp=='no')
								if(nuovaposizione%8!=0 && nuovaposizione>7) {
										temp = partita.caselle[nuovaposizione-(8)-1].colore;
										possibilita.push(nuovaposizione-(8)-1);
										nuovaposizione = (nuovaposizione-(8)-1);
										if(temp=='no')
										if(nuovaposizione%8!=0 && nuovaposizione>7) {
												temp = partita.caselle[nuovaposizione-(8)-1].colore;
												possibilita.push(nuovaposizione-(8)-1);
												nuovaposizione = (nuovaposizione-(8)-1);
												if(temp=='no')
												if(nuovaposizione%8!=0 && nuovaposizione>7) {
														temp = partita.caselle[nuovaposizione-(8)-1].colore;
														possibilita.push(nuovaposizione-(8)-1);
														nuovaposizione = (nuovaposizione-(8)-1);
														if(temp=='no')
														if(nuovaposizione%8!=0 && nuovaposizione>7) {
																possibilita.push(nuovaposizione-(8)-1);
														}
												}
										}
								}
						}
				}
 		}
		//alto destra
		posizione = posizioneoriginale;
		if(posizione%8!=7 && posizione>7) {
			temp = partita.caselle[posizione-(8)+1].colore;
			possibilita.push(posizione-(8)+1)
			posizione = (posizione-(8)+1);
			if(temp=='no')
			if(posizione%8!=7 && posizione>7) {
					temp = partita.caselle[posizione-(8)+1].colore;
					possibilita.push(posizione-(8)+1);
					posizione = (posizione-(8)+1);
					if(temp=='no')
					if(posizione%8!=7 && posizione>7) {
							temp = partita.caselle[posizione-(8)+1].colore;
							possibilita.push(posizione-(8)+1);
							posizione = (posizione-(8)+1);
							if(temp=='no')
							if(posizione%8!=7 && posizione>7) {
									temp = partita.caselle[posizione-(8)+1].colore;
									possibilita.push(posizione-(8)+1);
									posizione = (posizione-(8)+1);
									if(temp=='no')
									if(posizione%8!=7 && posizione>7) {
											temp = partita.caselle[posizione-(8)+1].colore;
											possibilita.push(posizione-(8)+1);
											posizione = (posizione-(8)+1);
											if(temp=='no')
											if(posizione%8!=7 && posizione>7) {
													temp = partita.caselle[posizione-(8)+1].colore;
													possibilita.push(posizione-(8)+1);
													posizione = (posizione-(8)+1);
													if(temp=='no')
													if(posizione%8!=7 && posizione>7) {
															possibilita.push(posizione-(8)+1);
													}
											}
									}
							}
					}
			}
		}
		//basso sinistra
		posizione = posizioneoriginale;
		if(posizione%8!=0 && posizione<56) {
				temp = partita.caselle[posizione+7].colore;
				possibilita.push(posizione+7);
				posizione = posizione+7;
				if(temp=='no') {
					if(posizione%8!=0 && posizione<56) {
							temp = partita.caselle[posizione+7].colore;
							possibilita.push(posizione+7);
							posizione = posizione+7;
							if(temp=='no') {
								if(posizione%8!=0 && posizione<56) {
										temp = partita.caselle[posizione+7].colore;
										possibilita.push(posizione+7);
										posizione = posizione+7;
										if(temp=='no') {
											if(posizione%8!=0 && posizione<56) {
													temp = partita.caselle[posizione+7].colore;
													possibilita.push(posizione+7);
													posizione = posizione+7;
													if(temp=='no') {
														if(posizione%8!=0 && posizione<56) {
																temp = partita.caselle[posizione+7].colore;
																possibilita.push(posizione+7);
																posizione = posizione+7;
																if(temp=='no') {
																	if(posizione%8!=0 && posizione<56) {
																			temp = partita.caselle[posizione+7].colore;
																			possibilita.push(posizione+7);
																			posizione = posizione+7;
																			if(temp=='no') {
																				if(posizione%8!=0 && posizione<56) {
																						possibilita.push(posizione+7);
																				}
																			}
																	}
																}
														}
													}
											}
										}
								}
							}
					}
				}
		}
		//basso destra
		posizione = posizioneoriginale;
		if(posizione%8!=7 && posizione<56) {
				temp = partita.caselle[posizione+9].colore;
				possibilita.push(posizione+9);
				posizione = posizione+9;
				if(temp=='no') {
					if(posizione%8!=7 && posizione<56) {
							temp = partita.caselle[posizione+9].colore;
							possibilita.push(posizione+9);
							posizione = posizione+9;
							if(temp=='no') {
								if(posizione%8!=7 && posizione<56) {
										temp = partita.caselle[posizione+9].colore;
										possibilita.push(posizione+9);
										posizione = posizione+9;
										if(temp=='no') {
											if(posizione%8!=7 && posizione<56) {
													temp = partita.caselle[posizione+9].colore;
													possibilita.push(posizione+9);
													posizione = posizione+9;
													if(temp=='no') {
														if(posizione%8!=7 && posizione<56) {
																temp = partita.caselle[posizione+9].colore;
																possibilita.push(posizione+9);
																posizione = posizione+9;
																if(temp=='no') {
																	if(posizione%8!=7 && posizione<56) {
																			temp = partita.caselle[posizione+9].colore;
																			possibilita.push(posizione+9);
																			posizione = posizione+9;
																			if(temp=='no') {
																				if(posizione%8!=7 && posizione<56) {
																						possibilita.push(posizione+9);
																				}
																			}
																	}
																}
														}
													}
											}
										}
								}
							}
					}
				}
		}
	}
	if(tipo.indexOf('torre')!=-1 || tipo.indexOf('regina')!=-1) {
		var temp;
		//alto
		posizione = posizioneoriginale;
		if(posizione>7) {
				temp = partita.caselle[posizione-(8)].colore;
				possibilita.push(posizione-(8));
				posizione = (posizione-(8));
				if(temp=='no') {
					if(posizione>7) {
							temp = partita.caselle[posizione-(8)].colore;
							possibilita.push(posizione-(8));
							posizione = (posizione-(8));
							if(temp=='no') {
								if(posizione>7) {
										temp = partita.caselle[posizione-(8)].colore;
										possibilita.push(posizione-(8));
										posizione = (posizione-(8));
										if(temp=='no') {
											if(posizione>7) {
													temp = partita.caselle[posizione-(8)].colore;
													possibilita.push(posizione-(8));
													posizione = (posizione-(8));
													if(temp=='no') {
														if(posizione>7) {
																temp = partita.caselle[posizione-(8)].colore;
																possibilita.push(posizione-(8));
																posizione = (posizione-(8));
																if(temp=='no') {
																	if(posizione>7) {
																			temp = partita.caselle[posizione-(8)].colore;
																			possibilita.push(posizione-(8));
																			posizione = (posizione-(8));
																			if(temp=='no') {
																				if(posizione>7) {
																						possibilita.push(posizione-(8));
																				}
																			}
																	}
																}
														}
													}
											}
										}
								}
							}
					}
				}
		}
		//basso
		posizione = posizioneoriginale;
		if(posizione<56) {
				temp = partita.caselle[posizione+(8)].colore;
				possibilita.push(posizione+(8));
				posizione = (posizione+(8));
				if(temp=='no') {
					if(posizione<56) {
							temp = partita.caselle[posizione+(8)].colore;
							possibilita.push(posizione+(8));
							posizione = (posizione+(8));
							if(temp=='no') {
								if(posizione<56) {
										temp = partita.caselle[posizione+(8)].colore;
										possibilita.push(posizione+(8));
										posizione = (posizione+(8));
										if(temp=='no') {
											if(posizione<56) {
													temp = partita.caselle[posizione+(8)].colore;
													possibilita.push(posizione+(8));
													posizione = (posizione+(8));
													if(temp=='no') {
														if(posizione<56) {
																temp = partita.caselle[posizione+(8)].colore;
																possibilita.push(posizione+(8));
																posizione = (posizione+(8));
																if(temp=='no') {
																	if(posizione<56) {
																			temp = partita.caselle[posizione+(8)].colore;
																			possibilita.push(posizione+(8));
																			posizione = (posizione+(8));
																			if(temp=='no') {
																				if(posizione<56) {
																						possibilita.push(posizione+(8));
																				}
																			}
																	}
																}
														}
													}
											}
										}
								}
							}
					}
				}
		}
		//destra
		posizione = posizioneoriginale;
		if(posizione%8!=7) {
				temp = partita.caselle[posizione+(1)].colore;
				possibilita.push(posizione+(1));
				posizione = (posizione+(1));
				if(temp=='no') {
					if(posizione%8!=7) {
							temp = partita.caselle[posizione+1].colore;
							possibilita.push(posizione+1);
							posizione = (posizione+1);
							if(temp=='no') {
								if(posizione%8!=7) {
										temp = partita.caselle[posizione+1].colore;
										possibilita.push(posizione+1);
										posizione = (posizione+1);
										if(temp=='no') {
											if(posizione%8!=7) {
													temp = partita.caselle[posizione+1].colore;
													possibilita.push(posizione+1);
													posizione = (posizione+1);
													if(temp=='no') {
														if(posizione%8!=7) {
																temp = partita.caselle[posizione+1].colore;
																possibilita.push(posizione+1);
																posizione = (posizione+1);
																if(temp=='no') {
																	if(posizione%8!=7) {
																			temp = partita.caselle[posizione+1].colore;
																			possibilita.push(posizione+1);
																			posizione = (posizione+1);
																			if(temp=='no') {
																				if(posizione%8!=7) {
																						possibilita.push(posizione+1);
																				}
																			}
																	}
																}
														}
													}
											}
										}
								}
							}
					}
				}
		}
		//sinistra
		posizione = posizioneoriginale;
		if(posizione%8!=0) {
				temp = partita.caselle[posizione-(1)].colore;
				possibilita.push(posizione-(1));
				posizione = (posizione-(1));
				if(temp=='no') {
					if(posizione%8!=0) {
							temp = partita.caselle[posizione-1].colore;
							possibilita.push(posizione-1);
							posizione = (posizione-1);
							if(temp=='no') {
								if(posizione%8!=0) {
										temp = partita.caselle[posizione-1].colore;
										possibilita.push(posizione-1);
										posizione = (posizione-1);
										if(temp=='no') {
											if(posizione%8!=0) {
													temp = partita.caselle[posizione-1].colore;
													possibilita.push(posizione-1);
													posizione = (posizione-1);
													if(temp=='no') {
														if(posizione%8!=0) {
																temp = partita.caselle[posizione-1].colore;
																possibilita.push(posizione-1);
																posizione = (posizione-1);
																if(temp=='no') {
																	if(posizione%8!=0) {
																			temp = partita.caselle[posizione-1].colore;
																			possibilita.push(posizione-1);
																			posizione = (posizione-1);
																			if(temp=='no') {
																				if(posizione%8!=0) {
																						possibilita.push(posizione-1);
																				}
																			}
																	}
																}
														}
													}
											}
										}
								}
							}
					}
				}
		}
	}
	if(tipo=='rebianco' || tipo=='renero' || tipo.indexOf(' rebianco')!=-1 || tipo.indexOf(' renero')!=-1) {
		posizione = posizioneoriginale;
		if(posizione>7) {
				possibilita.push(posizione-(8))
		}
		if(posizione<56) {
				possibilita.push(posizione+(8))
		}
		if(posizione%8!=0) {
				possibilita.push(posizione-(1))
		}
		if(posizione%8!=7) {
				possibilita.push(posizione+(1))
		}
		if(posizione%8!=7 && posizione>7) {
				possibilita.push(posizione-(7))
		}
		if(posizione%8!=0 && posizione>7) {
				possibilita.push(posizione-(9))
		}
		if(posizione%8!=0 && posizione<56) {
				possibilita.push(posizione+(7))
		}
		if(posizione%8!=7 && posizione<56) {
				possibilita.push(posizione+(9))
		}
	}
	return possibilita;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
