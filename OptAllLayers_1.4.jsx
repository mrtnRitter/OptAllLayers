{
	script(this);
		
	// gui function - all of this is has to be this way
	function script(thisObj){
		function buildUI(thisObj){
			// check if panel or window
			var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "OptAllLayers", undefined, {resizeable:true});
			
			// content of gui
			myPanel.alignChildren = ['fill', 'fill'];
			myPanel.minimumSize = [194,324];
			
			// ----------------------- Container -----------------------
			container = myPanel.add('group');
			container.orientation = 'stack';
			container.alignChildren = ['fill','fill'];
			container.minimumSize = myPanel.minimumSize;
		
			// ----------------------- Main -----------------------
			mainres = "group{orientation:'column', alignment:['fill','fill'], alignChildren:['fill','fill'],\
						panelComp: Panel{text:'Composition', orientation:'column', alignment:['fill','top'], alignChildren:['fill','fill'],\
							compList: DropDownList{properties:{items:['']}},\
							compTxt: StaticText{text:'All composition selected'},\
						},\
						panelMB: Panel{text:'Motionblur', orientation:'row',alignment:['fill','top'], alignChildren:['fill','fill'],\
							MBact: RadioButton{text:' on'},\
							MBdeact: RadioButton{text:' off'},\
							MBdn: RadioButton{text:' ignore'},\
						},\
						panelCT: Panel{text:'Collapse Transformation', orientation:'row',alignment:['fill','top'], alignChildren:['fill','fill'],\
							CTact: RadioButton{text:' on'},\
							CTdeact: RadioButton{text:' off'},\
							CTdn: RadioButton{text:' ignore'},\
						},\
						panelOpt: Panel{text:'Include', orientation:'column',alignment:['fill','top'], alignChildren:['fill','fill'],\
							subcompCheck: Checkbox{text:' layers in pre-comps'},\
							invisiblelayerCheck: Checkbox{text:' invisible layers'},\
						},\
						groupOne: Group{orientation:'row', alignment:['fill','fill'],\
							startBtn: Button{text:'Go!', alignment:['fill', 'fill']},\
							infoBtn: Button{text:'?', alignment:['right', 'fill'], maximumSize:[20,10000]},\
						},\
					}";
			
			mainPanel = container.add(mainres);
			
			// ----------------------- About -----------------------
			aboutres = "group{orientation:'column', alignment:['fill','fill'], alignChildren:['fill','fill'],\
						groupTxt: Group{orientation:'column', alignment:['fill','top'], minimumSize:[190,284],\
							aboutHl: StaticText{text:'OptAllLayers 1.4'},\
							aboutTxt: StaticText{properties:{multiline: true}, maximumSize: [190,284], text:'\\nActivate or deactivate motionblur and collapse transformation for all layers with one click.\\n\\n'},\
							prefBtn: Button{text:'Change Defaults',alignment:['fill', 'fill']},\
							blindTxt: StaticText{text:''},\
							urlTxt: StaticText{minimumSize: [190,0], text:'Developed by:'},\
							urlBtn: Button{text:'www.vogelmoritz.de',alignment:['fill', 'fill']},\
							mailTxt: StaticText{minimumSize: [190,0], text:'Contact:'},\
							mailBtn: Button{text:'dev@vogelmoritz.de',alignment:['fill', 'fill']},\
						},\
						groupOne: Group{orientation:'column', alignment:['fill','fill'],\
							backBtn: Button{text:'< back',alignment:['fill', 'fill']},\
						},\
					}";
			aboutPanel = container.add(aboutres);
			aboutPanel.hide();
			
			
			// ----------------------- Prefs -----------------------
			prefres = "group{orientation:'column', alignment:['fill','fill'], alignChildren:['fill','fill'],\
						groupTxt: Group{orientation:'column', alignment:['fill','top'],\
							prefTxt: StaticText{text: 'Select your default settings', alignment:['left','top']},\
						},\
						panelComp: Panel{text:'Composition', orientation:'column', alignment:['fill','top'], alignChildren:['fill','fill'],\
							compList: DropDownList{properties:{items:['ALL', 'SELECTION']}},\
						},\
						panelMB: Panel{text:'Motionblur', orientation:'row',alignment:['fill','top'], alignChildren:['fill','fill'],\
							MBact: RadioButton{text:' on'},\
							MBdeact: RadioButton{text:' off'},\
							MBdn: RadioButton{text:' ignore'},\
						},\
						panelCT: Panel{text:'Collapse Transformation', orientation:'row',alignment:['fill','top'], alignChildren:['fill','fill'],\
							CTact: RadioButton{text:' on'},\
							CTdeact: RadioButton{text:' off'},\
							CTdn: RadioButton{text:' ignore'},\
						},\
						panelOpt: Panel{text:'Include', orientation:'column',alignment:['fill','top'], alignChildren:['fill','fill'],\
							subcompCheck: Checkbox{text:' layers in pre-comps'},\
							invisiblelayerCheck: Checkbox{text:' invisible layers'},\
						},\
						groupOne: Group{orientation:'row', alignment:['fill','fill'],\
							backBtn: Button{text:'< back', alignment:['fill', 'fill']},\
							saveBtn: Button{text:'save', alignment:['fill', 'fill']},\
						},\
					}";
			prefPanel = container.add(prefres);
			prefPanel.panelComp.compList.selection = 0;
			prefPanel.panelMB.MBdn.value = true;
			prefPanel.panelCT.CTdn.value = true;
			prefPanel.hide();
			
			
			// ----------------------- Pop Up Window -----------------------
			var PopupBox = new Window("palette", "processing...", undefined, {resizeable:false, closeButton:false});
			
			PopupBox.alignChildren = ['fill', 'fill'];
									
			processres = "group{orientation:'column', alignment:['fill','fill'], alignChildren:['fill','fill'],\
							groupTxt: Group{orientation:'column', alignment:['fill','fill'], size:[400,40],\
								infoBoxTxtupper: StaticText{text: 'processing layer:', alignment:['fill','fill']},\
								infoBoxTxt: StaticText{text: '', alignment:['fill','fill']},\
						},\
					}";
			processBox = PopupBox.add(processres);
			
			
					
			// panel sizing and resizing
			myPanel.layout.layout(true);
			myPanel.layout.resize();
			myPanel.onResizing = myPanel.onResize = function(){
				this.layout.resize();
				// dd item size bug fix
				prefPanel.panelComp.compList.itemSize = mainPanel.panelComp.compList.itemSize = [mainPanel.panelComp.compList.size[0]-27,mainPanel.panelComp.compList.size[1]];
				
			};	
		
			// grap all comps and add them to dropdownlist
			listallcomps();
			
					
			// set defaults
			var myFileName = "OptAllLayersPrefs.txt";
			var myFilePath = File($.fileName).path + "/" + myFileName;
			
			if (File(myFilePath).exists){
				myFile = File(myFilePath);
				myFile.open("r");
				eval(myFile.read());
				myFile.close();
			} else {
			mainPanel.panelComp.compList.selection = 0;	
			
			mainPanel.panelMB.MBact.value = false;
			mainPanel.panelMB.MBdeact.value = false;
			mainPanel.panelMB.MBdn.value = true;
			
			mainPanel.panelCT.CTact.value = false;
			mainPanel.panelCT.CTdeact.value = false;
			mainPanel.panelCT.CTdn.value = true;
			
			mainPanel.panelOpt.subcompCheck.value = false;
			mainPanel.panelOpt.invisiblelayerCheck.value = false;
			}
			
			// <-- END OF INTERFACE
			
			// -----------------------------------------------------------------------------------------------------
			// --------------------------------------------- EVENTS --------------------------------------------
			// -----------------------------------------------------------------------------------------------------

			// ---------------------- REFRESH TEXT AND COMPARRAY ----------------------
			mainPanel.addEventListener("mouseover", UpdateTextCreateProcessComp);
				
			// --------------------------- RESET STATIC TEXT --------------------------
			//mainPanel.addEventListener("mouseout", myTimeout);
				
			// ----------------------- REFRESH COMPOSITION LIST -----------------------
			mainPanel.panelComp.addEventListener("mouseover", listallcomps);
			
			// ----------------------- REFRESH PREFTXT -----------------------
			prefPanel.addEventListener("mouseover", function(){prefPanel.groupTxt.prefTxt.text = "Select your default settings";});
			
			
			
			// -----------------------------------------------------------------------------------------------------
			// ---------------------------------------------- BUTTONS ----------------------------------------------
			// -----------------------------------------------------------------------------------------------------
			
			// ----------------------- GO -----------------------
			mainPanel.groupOne.startBtn.onClick = function(){
			
				// change button text to show, that the script is running
				mainPanel.groupOne.startBtn.text = "processing...";
				
				if (myPanel instanceof Window){
					myPanel.update();
				} else {
					PopupBox.center();
					PopupBox.show();	
				}
				// read out settings: mb, ct, pc, ll
				
				// --------- MOTIONBLUR ---------
				if (mainPanel.panelMB.MBact.value){
					mb = true;
				} else if (mainPanel.panelMB.MBdeact.value){
					mb = false;
				} else if (mainPanel.panelMB.MBdn.value){
					mb = null;
				}
				
				// --------- COLLAPSE TRANSFFORMATION ---------
				if (mainPanel.panelCT.CTact.value){
					ct = true;
				} else if (mainPanel.panelCT.CTdeact.value){
					ct = false;
				} else if (mainPanel.panelCT.CTdn.value){
					ct = null;
				}
				
				// --------- PRECOMPS ---------
				pc = mainPanel.panelOpt.subcompCheck.value;
				
				// --------- INVISIBLE LAYERS ---------
				il = mainPanel.panelOpt.invisiblelayerCheck.value;
						
				// DO THE MAGIC		
				app.beginUndoGroup('OptAllLayers');
				exec(processComp);
				app.endUndoGroup();
				
				// reset button text to normal state
				mainPanel.groupOne.startBtn.text = "Go!";
				mainPanel.panelComp.compTxt.text = "done";
				PopupBox.hide();	
			}

			// ----------------------- INFO -----------------------
			mainPanel.groupOne.infoBtn.onClick = function(){
				mainPanel.hide();
				aboutPanel.show();
				prefPanel.hide();
			}
			
			// ----------------------- BACK -----------------------
			aboutPanel.groupOne.backBtn.onClick = function(){
				mainPanel.show();
				aboutPanel.hide();
				prefPanel.hide();
			}
				
			// ----------------------- URL -----------------------	
			aboutPanel.groupTxt.urlBtn.onClick = function(){
				
				url = "";
				
				cmd = null;
								
				if ($.os.indexOf("Win") != -1){
					cmd = "cmd.exe /k start " + url ;
				} else {
					cmd = "open \"" + url + "\"";  
				}
				
				if (cmd != null){
					system.callSystem(cmd);	
				} else {
					alert ("No browser found.")
				}
			}
			
			// ----------------------- MAIL -----------------------	
			aboutPanel.groupTxt.mailBtn.onClick = function(){
			
				mail = "";
				
				cmd = null;
							
				if ($.os.indexOf("Win") != -1){
					cmd = "cmd.exe /k" + " start mailto:" + mail + "?subject=OptAllLayers"
				} else {
					cmd = "open \"" + url + "\"";  
				}
				
				if (cmd != null){
					system.callSystem(cmd);	
				} else {
					alert ("No e-mail client found.")
				}
			}
			
			// ----------------------- SETTINGS -----------------------	
			aboutPanel.groupTxt.prefBtn.onClick = function(){
				mainPanel.hide();
				aboutPanel.hide();
				prefPanel.show();
			}
			
			// ----------------------- SETTINGS BACK -----------------------
			prefPanel.groupOne.backBtn.onClick = function(){
				mainPanel.hide();
				aboutPanel.show();
				prefPanel.hide();
			}
			
			// ----------------------- SETTINGS SAVE -----------------------
			prefPanel.groupOne.saveBtn.onClick = function(){	
				prefdd = String(prefPanel.panelComp.compList.selection.index);
				prefmbact = String(prefPanel.panelMB.MBact.value);
				prefmbdeact = String(prefPanel.panelMB.MBdeact.value);
				prefmbdn = String(prefPanel.panelMB.MBdn.value);
				prefctact = String(prefPanel.panelCT.CTact.value);
				prefctdeact = String(prefPanel.panelCT.CTdeact.value);
				prefctdn = String(prefPanel.panelCT.CTdn.value);	
				prefpc = String(prefPanel.panelOpt.subcompCheck.value);
				prefil = String(prefPanel.panelOpt.invisiblelayerCheck.value);
				
				var myMessage = "mainPanel.panelComp.compList.selection = " + prefdd + ";\nmainPanel.panelMB.MBact.value = " + prefmbact + ";\nmainPanel.panelMB.MBdeact.value = " + prefmbdeact + ";\nmainPanel.panelMB.MBdn.value = " + prefmbdn + ";\nmainPanel.panelCT.CTact.value = " + prefctact + ";\nmainPanel.panelCT.CTdeact.value = " + prefctdeact + ";\nmainPanel.panelCT.CTdn.value = " + prefctdn + ";\nmainPanel.panelOpt.subcompCheck.value = " + prefpc + ";\nmainPanel.panelOpt.invisiblelayerCheck.value = " + prefil + ";";
							
				myFile = new File(myFilePath);
			
				myFile.open("w");
				myFile.write(myMessage);
				myFile.close();

				prefPanel.groupTxt.prefTxt.text = "Settings saved!";
				
				myFile.open("r");
				eval(myFile.read());
				myFile.close();
			}

			// -----------------------------------------------------------------------------------------------------
			// --------------------------------------------- FUNCTIONS ---------------------------------------------
			// -----------------------------------------------------------------------------------------------------
						
			// ------------------- UpdateTextCreateProcessComp ------------------- 
			function UpdateTextCreateProcessComp(){
								
				// reset array so we always start fresh and clean
				processComp = [];
				
				// read out settings: comp
				
				// produce processComp array, which includes all comps which need to be processed
				
				// --------- ALL ---------
				if (mainPanel.panelComp.compList.selection == 0){
					for (i = 1; i <= app.project.numItems; i++){
						if (app.project.items[i] instanceof CompItem){
							processComp.push(app.project.items[i]);
							mainPanel.panelComp.compTxt.text = "All composition selected";
						}
					}
				}
				
				// --------- SELECTION ---------
				if (mainPanel.panelComp.compList.selection == 1){			
					// case 1: project panel no selection, or project panel selected with only one item, or comppanel selected	
					if ((app.project.selection.length >= 0) && (app.project.activeItem != null) && (app.project.activeItem instanceof CompItem)){
						processComp = [app.project.activeItem];
						mainPanel.panelComp.compTxt.text = processComp[0].name + " selected";
					} else if ((app.project.selection.length == 0) && (app.project.activeItem == null)){
						mainPanel.panelComp.compTxt.text = "No composition will be processed.";
					}
										
					// case 2: project panel one or more selection
					// project panel selected with more than one item
					if ((app.project.selection.length > 0) && (app.project.activeItem == null)){
						// filter compItems from selection and push them to processComp
						for (i = 0; i <= app.project.selection.length; i++){
							if (app.project.selection[i] instanceof CompItem){
								processComp.push(app.project.selection[i]);
								mainPanel.panelComp.compTxt.text = processComp.length + " compositions selected";
							}
						}
					}
					// if only folders and stuff is selected
					if (processComp.length == 0){
						mainPanel.panelComp.compTxt.text = "No composition selected";
					}
				}

				// --------- SPECIFIED ---------
				if (mainPanel.panelComp.compList.selection > 1){
					// use the index from the dd to refer to the array - aka to the actual [object item]. -3 because the dd has already some entries
					processComp = [compArr[mainPanel.panelComp.compList.selection.index - 3]];
					mainPanel.panelComp.compTxt.text = processComp[0].name + " selected";
				}
				// <- end of dropdown
				return processComp;
			}
			
			// ------------------- TIMEOUT -------------------
			function myTimeout (){
				app.setTimeout(resetText,5000);
			}
			
			// ------------------- RESETTEXT ------------------- 
			
			function resetText (){
				mainPanel.panelComp.compTxt.text = "";
			}
			
			// ------------------- LISTALLCOMPS ------------------- 
			function listallcomps (){
				// grap listitemindex to set this one as default later
				itemSel = String(mainPanel.panelComp.compList.selection);
				
				// reset array and dd
				compArr = [];
				mainPanel.panelComp.compList.removeAll();
				
				// re-add prototype entries
				mainPanel.panelComp.compList.add('item','ALL');
				mainPanel.panelComp.compList.add('item','SELECTION');
				mainPanel.panelComp.compList.add('separator','-');
				
				// 3 entries do already exist, we start counting from 0
				j = 2;
				// add all other entries
				for (i = 1; i <= app.project.numItems; i++){
					if (app.project.items[i] instanceof CompItem){
						// push all matches as [object item] to the array
						compArr.push(app.project.items[i]);
						// add all names of [object item] to the dropdown
						mainPanel.panelComp.compList.add('item',app.project.items[i].name);
						// everytime the if kicks in, j increases
						j++;
						// if previous selected item is just added item, this one gets selection
						if (itemSel == app.project.items[i].name){
							mainPanel.panelComp.compList.selection = j;
						}
					}
				}
				// if one of the statics entries where selected, they get restored
				if (itemSel == "ALL" || itemSel == null){
					mainPanel.panelComp.compList.selection = 0;
				} else if (itemSel == "SELECTION"){
					mainPanel.panelComp.compList.selection = 1;
				}
				
				return compArr;
			}
						
			// ------------------- EXEC (DO THE MAGIC FUNTION) -------------------
			function exec (processComp){
				// compositions loop
				for (var i = 0; i < processComp.length; i++){
					var comp = processComp[i];
					var layers = comp.layers;
					var layers_counter = comp.layers.length;
					var relock = false;

					// activate motionblur switch in compviewer
					if (mb != null){
						comp.motionBlur = mb;
					}
					
					// layers loop
					for (var j = 1; j <= layers_counter; j++){
						layer = layers[j];
						visible = layers[j].enabled; // layer is visible
						locked = layers[j].locked; // layer is locked
						
						if (locked){
							layer.locked = false;
							relock = true;
						}
						
						//-------------- OPTION: INCLUDE INVISIBLE LAYERS --------------
						// case 1: layer is visible
						if (visible){
							execOptions();
						// case 2: layer is not visible and option is not checked
						} else if (visible == false && il == false){
							continue;
						// case 3: layer is not visible and option is checked
						} else if (visible == false && il){
							execOptions();
						}
						
						// -------------- OPTION: INCLUDE PRECOMPS --------------
						if (pc && layer.source instanceof CompItem){
							exec([layer.source]);
						}
						
						if (relock){
							layer.locked = true;
						}
					}
				}
			}
			
			// ------------------- execOptions -------------------
			function execOptions (){
				// do motion blur
				if (mb != null){
					mainPanel.panelComp.compTxt.text = "processing layer: " + layer.name;
					processBox.groupTxt.infoBoxTxt.text = layer.name;
					
					if (myPanel instanceof Window){
						myPanel.update();
					} else {
						PopupBox.update();
					}

					layer.motionBlur = mb;
				}
						
				// do coltrans
				if ((ct != null) && (layer.canSetCollapseTransformation)){
					mainPanel.panelComp.compTxt.text = "processing layer: " + layer.name;
					processBox.groupTxt.infoBoxTxt.text = layer.name;
					
					if (myPanel instanceof Window){
						myPanel.update();
					} else {
						PopupBox.update();
					}
					
					layer.collapseTransformation = ct;
				}
			}

			// <-- end of main function
			return myPanel;				
		}	
		
		// floating window
		var myScriptPal = buildUI(thisObj);
		if ((myScriptPal != null) && (myScriptPal instanceof Window)){
			myScriptPal.center();
			myScriptPal.show();
		}
	}
}
