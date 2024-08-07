/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-debugger */
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
// Cette version de code fonctionne sur n'importe quelle maquette.
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
let rapport: string = 'INVENTAIRE DES COMPOSANTS' + '\n' + '\n';

//let msg_1_String: string = "";
/////////////let pagesAfouiller: Array<string>= ['Test', 'Components Test'];
//let pagesAfouiller: Array<string>= ['Maquette V3', 'Composants'];
//debugger;
///////////////////////////

figma.ui.onmessage = async (msg: { type: string, count: number }) => {

  // Script : Créer l'inventaire
  if (msg.type === 'create-inventory') {
    listComposants();
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

//////////////// recherche par Id /////////////////////
/*if (msg.type === 'display-composant-id-1') {
  msg_1_String = String(msg.count);

}

if (msg.type === 'display-composant-id-2') {
  //New script : Build the inventory

  let msg_2_String = String(msg.count);
  let msg_String: string = msg_1_String + ':' + msg_2_String;


  for (const UnePageAfouiller of pagesAfouiller) {
    debugger;
    let composantPage = figma.root.findChild(node => node.name === UnePageAfouiller);
    if (composantPage !== null) {
      center_on_this(composantPage, msg_String);
    }
  }



/*
  let composantPage = figma.root.findChild(node => node.name === pagesAfouiller[0]);

  if (composantPage !== null) {
    center_on_this(composantPage, msg_String);

  }

  composantPage = figma.root.findChild(node => node.name === pagesAfouiller[1]);
  if (composantPage !== null) {
    center_on_this(composantPage, msg_String)
  }*/









/* CALLED FONCTIONS START HERE */

async function center_on_this(composantPage: PageNode, msg_String: string) {

await figma.setCurrentPageAsync(composantPage); // installs the view into a given page
await composantPage.loadAsync();
let nodes = composantPage.findAll(n => n.id === msg_String);
figma.currentPage.selection = nodes;
figma.viewport.scrollAndZoomIntoView(nodes);// zoom the view to a given node

}//////////////





/* CALLED FUNCTIONS START HERE */

function listComposants() {
  //des problèmes d'attente pour le chargement des pages.
  //figma.loadAllPagesAsync();

  const currentPage = figma.currentPage;
  rapport += '\n' + 'Page : ' + currentPage.name.toUpperCase() + '\n';

  // Parcourir tous les nœuds de la page actuelle
  for (const node of walkTree(currentPage)) {
    analyse_element(node as SceneNode);// Analyser chaque nœud
  }

  assignText();  // Assigner le texte du rapport à la page "Inventaire"
}


// Générateur qui produit tous les nœuds dans le sous-arbre
// en commençant par le nœud donné
// 
function* walkTree(node: BaseNode): IterableIterator<BaseNode> {
  yield node;  // Renvoyer le nœud actuel
  if ('children' in node) {
    for (const child of node.children) {
      yield* walkTree(child);  // Renvoyer les enfants de manière récursive
    }
  }
}


///////////////////////////////////////////////////////////////
/*Fonction pour analyser un nœud

function analyse_element(layer: SceneNode) {

  switch (layer.type) {
    case 'RECTANGLE': {
      analyse_rect(layer);
      break;
    }
    case 'TEXT': {
      analyse_text(layer);
      break;
    }
    case 'INSTANCE': {
      analyse_instance(layer);
      break;
    }
    case 'COMPONENT': {
      analyse_composant(layer);
      break;
    }
    case 'COMPONENT_SET': {
      analyse_composant_set(layer);
      break;
    }
  }

}

function analyse_rect(layer: RectangleNode) {

  console.log('\n' + 'Rectangle');
  console.log(
    'Nom : ' + layer.name + ' Id : ' + layer.id + '\n'
  );
  console.log(
    'Position x : ' + layer.x + ' Position y : ' + layer.y + ' Height : ' + layer.height + ' Width : ' + layer.width + '\n'
  );


  rapport += String('\n' + 'Rectangle');
  rapport += String('\n' + 'Nom : ' + layer.name + ' Id : ' + layer.id);
  rapport += String('\n' + 'Position x : ' + layer.x + ' Position y : ' + layer.y + ' Height : ' + layer.height + ' Width : ' + layer.width);


  //if (layer.strokeCap !== figma.mixed) {
  //  console.log(
  //    ' StrokeCap : '+ layer.strokeCap
  //   }

  if (layer.strokeWeight === figma.mixed) {
    console.log(
      'StrokeBottomWeight : ' + layer.strokeBottomWeight +
      'StrokeTopWeight : ' + layer.strokeTopWeight +
      'StrokeLeftWeight : ' + layer.strokeLeftWeight +
      'StrokeRightWeight : ' + layer.strokeRightWeight +
      'StrokeAlign : ' + layer.strokeAlign
    );
    rapport += String('\n' +
      'StrokeBottomWeight : ' + layer.strokeBottomWeight +
      'StrokeTopWeight : ' + layer.strokeTopWeight +
      'StrokeLeftWeight : ' + layer.strokeLeftWeight +
      'StrokeRightWeight : ' + layer.strokeRightWeight +
      'StrokeAlign : ' + layer.strokeAlign);
  } else {
    console.log(
      'StrokeWeight :' + layer.strokeWeight + ' StrokeAlign : ' + layer.strokeAlign
    );
    rapport += String('\n' + ' StrokeWeight :' + layer.strokeWeight + ' StrokeAlign : ' + layer.strokeAlign);

  }

  layer.setFillStyleIdAsync;
  if (layer.fills !== figma.mixed) {
    const rect: ReadonlyArray<Paint> = layer.fills;
    if (rect[0].type === 'SOLID') {
      console.log('\n' +
        'Fill type : ' + rect[0].type +
        'Fill color : r ' + rect[0].color.r + ', g ' + rect[0].color.g + ', b ' + rect[0].color.b +
        'Fill opacity : ' + rect[0].opacity +
        'Visible :' + rect[0].visible +
        'Fill blendMode : ' + rect[0].blendMode + '\n' + '\n'
      );
      rapport += String('\n' +
        'Fill type : ' + rect[0].type +
        'Fill color : r ' + rect[0].color.r + ', g ' + rect[0].color.g + ', b ' + rect[0].color.b +
        'Fill opacity : ' + rect[0].opacity +
        'Visible :' + rect[0].visible +
        'Fill blendMode : ' + rect[0].blendMode + '\n' + '\n');

    }
  }


}

function analyse_text(layer: TextNode) {

  console.log('\n' + 'Text');
  console.log(
    'Nom : ' + layer.name + ' Id : ' + layer.id + '\n'
  );
  console.log(
    'Position x : ' + layer.x + ' Position y : ' + layer.y + ' Height : ' + layer.height + ' Width : ' + layer.width
  );

  rapport += String('\n' + 'Text');
  rapport += String('\n' + 'Nom : ' + layer.name + ' Id : ' + layer.id);
  rapport += String('\n' + 'Position x : ' + layer.x + ' Position y : ' + layer.y + ' Height : ' + layer.height + ' Width : ' + layer.width);

  if (layer.strokeWeight === figma.mixed) {
    console.log('\n' +
      'Text stroke : ' + layer.strokes + ' Stroke value : ' + layer.characters
    );
    rapport += String('\n' + ' Text stroke : ' + layer.strokes + ' Stroke value : ' + layer.characters);
  } else {
    console.log('\n' +
      'Text stroke : ' + layer.strokes + ' Stroke value : ' + layer.characters
    );
    rapport += String('\n' + 'Text stroke : ' + layer.strokes + ' Stroke value : ' + layer.characters);
  }

  layer.setFillStyleIdAsync;
  if (layer.fills !== figma.mixed) {
    const rect: ReadonlyArray<Paint> = layer.fills;
    if (rect[0].type === 'SOLID') {
      console.log('\n' +
        'Fill type : ' + rect[0].type +
        'Fill color : r ' + rect[0].color.r + ', g ' + rect[0].color.g + ', b ' + rect[0].color.b +
        'Fill opacity : ' + rect[0].opacity +
        'Visible :' + rect[0].visible +
        'Fill blendMode : ' + rect[0].blendMode + '\n' + '\n'
      );
      rapport += String('\n' +
        'Fill type : ' + rect[0].type +
        'Fill color : r ' + rect[0].color.r + ', g ' + rect[0].color.g + ', b ' + rect[0].color.b +
        'Fill opacity : ' + rect[0].opacity +
        'Visible :' + rect[0].visible +
        'Fill blendMode : ' + rect[0].blendMode + '\n' + '\n');
    }
  }

}


function analyse_composant(layer: ComponentNode) {

  console.log('\n' + 'Component');
  console.log('\n' + 'Nom : ' + layer.name + ' Id : ' + layer.id);
  console.log('\n' + 'Position x : ' + layer.x + ' Position y : ' + layer.y + ' Height : ' + layer.height + ' Width : ' + layer.width);

  rapport += String('\n' + 'Component');
  rapport += String('\n' + 'Nom : ' + layer.name + ' Id : ' + layer.id);
  rapport += String('\n' + 'Position x : ' + layer.x + ' Position y : ' + layer.y + ' Height : ' + layer.height + ' Width : ' + layer.width + '\n');


  //debugger;

}

function analyse_composant_set(layer: ComponentSetNode) {

  console.log('\n' + 'Component_Set');
  console.log('\n' + 'Nom : ' + layer.name + ' Id : ' + layer.id);
  console.log('\n' + 'Position x : ' + layer.x + ' Position y : ' + layer.y + ' Height : ' + layer.height + ' Width : ' + layer.width);

  rapport += String('\n' + 'Component_Set');
  rapport += String('\n' + 'Nom : ' + layer.name + ' Id : ' + layer.id);
  rapport += String('\n' + 'Position x : ' + layer.x + ' Position y : ' + layer.y + ' Height : ' + layer.height + ' Width : ' + layer.width);


  const compMaitreSetDef = layer.componentPropertyDefinitions;

  type PropertyType = {
    [property: string]: string;
  }

  if (compMaitreSetDef !== null) {



    Object.keys(compMaitreSetDef).forEach(key => {

      Object.keys(compMaitreSetDef[key]).forEach(value => {
        if (value === 'variantOptions') {
          //debugger;
          const arr = compMaitreSetDef[key].variantOptions;
          if (arr !== undefined && arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              rapport += String('\n' + ' Variant Nom : ' + arr[i]);
            }
          }
          rapport += String('\n');
        }
      });
    });
  }
}


function analyse_instance(layer: InstanceNode) {

  const compMaitre = layer.getMainComponentAsync();
  compMaitre.then(function (result) {

    console.log('\n' + 'Instance');
    console.log('\n' + 'Nom : ' + layer.name + ' Id : ' + layer.id);
    console.log('\n' + 'Position x : ' + layer.x + ' Position y : ' + layer.y + ' Height : ' + layer.height + ' Width : ' + layer.width);

    rapport += String('\n' + 'Instance');
    rapport += String('\n' + 'Nom : ' + layer.name + ' Id : ' + layer.id);
    rapport += String('\n' + 'Position x : ' + layer.x + ' Position y : ' + layer.y + ' Height : ' + layer.height + ' Width : ' + layer.width);

    if (result !== null) {
      const compMaitre: ComponentNode = result;
      const compMaitreSet = result.parent;

      if (compMaitreSet !== null && compMaitreSet.type !== 'COMPONENT_SET') {

        rapport += String('\n' + 'Component maitre nom :' + compMaitre.name);
        rapport += String('\n' + 'Component maitre id :' + compMaitre.id);
        console.log('\n');
        rapport += '\n';
      }
      else {
        if (compMaitreSet !== null && compMaitreSet.type === 'COMPONENT_SET') {
          const compMaitreSetDef = compMaitreSet.componentPropertyDefinitions;

          type PropertyType = {
            [property: string]: string;
          }

          if (layer.variantProperties !== null) {
            const thisProperty: PropertyType = layer.variantProperties;
            //iteration into an objet!
            Object.keys(thisProperty).forEach(key => {
              console.log('\n' + 'Property : ' + key);
              rapport += String('\n' + 'Component maitre nom :' + compMaitreSet.name);
              rapport += String('\n' + 'Component maitre id :' + compMaitreSet.id);
              rapport += String('\n' + 'Property : ' + key);

              if (layer.variantProperties !== null && layer.variantProperties[key] !== null) {
                rapport += String('\n' + 'Value : ' + layer.variantProperties[key]);
              }
              console.log('\n');
              rapport += '\n';
              //debugger;
            });
          }



        }
      }
    }
  })
}*/
//////////////////////////////////////////////////////////////

function analyse_element(layer: SceneNode, depth: number = 0) {
  // Ajouter des informations de base sur le nœud au rapport avec indentation en fonction de la profondeur
  rapport += `${'  '.repeat(depth)}ID: ${layer.id} _ Name: ${layer.name} _ Type: ${layer.type}`;
  
  // Ajouter les dimensions si disponibles
  if ('width' in layer && 'height' in layer) {
    rapport += ` || Width: ${layer.width} _ Height: ${layer.height}`;
  }
  rapport += '\n';

  // Analyser les enfants si le nœud est un groupe
  if (layer.type === 'GROUP' && 'children' in layer) {
    analyse_group(layer as GroupNode, depth + 1);
  }
}

// Fonction pour analyser un groupe de nœuds
function analyse_group(layer: GroupNode, depth: number) {
  const gr_children = layer.children;
  for (let i = 0; i < gr_children.length; i++) {
    const comp = gr_children[i];
    analyse_element(comp, depth);  // Analyser chaque enfant du groupe
    if (i < gr_children.length - 1) {
      rapport += '\n'; 
      // Ajouter un double saut de ligne entre les enfants
    }
  }
}

// Point de départ de l'inventaire
const rootNodes = figma.currentPage.children;
for (let i = 0; i < rootNodes.length; i++) {
  const node = rootNodes[i];
  analyse_element(node);
  if (i < rootNodes.length - 1) {
    rapport += '\n'; 
    rapport += '\n'; 
    rapport += '\n'; 
 // Ajouter un double saut de ligne entre les éléments principaux
  }
}


// Fonction pour assigner le texte du rapport à la page "Inventaire"
async function assignText() {
  let inventoryPage = figma.root.findChild(node => node.name === 'Inventaire');

  // Créer une page et un rapport 
  try {
    if (inventoryPage === null) {
      // Create page and report
      inventoryPage = figma.createPage();
      inventoryPage.name = "Inventaire";
      const text = figma.createText();

      text.x = 50;
      text.y = 50;
      text.name = 'Rapport'
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      text.characters = rapport;
      text.fontSize = 18;
      text.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
      inventoryPage.appendChild(text);
    } else {
      // Nettoyer le rapport dans la page "Inventaire"
      const inventaire_node = inventoryPage.findChildren(n => n.name.includes("Rapport"));
      if (inventaire_node.length > 0) {
        const champ = inventaire_node[0];
        if (champ.type === 'TEXT') {
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          champ.characters = "";
          champ.characters = rapport;
        }
      }
    }

    // Sélectionner le nœud de texte du rapport
    if (inventoryPage !== null) {
      await figma.setCurrentPageAsync(inventoryPage); // installs the view into a given page
      const nodes: ReadonlyArray<BaseNode> = inventoryPage.findChildren(n => n.name.includes("Rapport"));
      figma.viewport.scrollAndZoomIntoView(nodes); // zoom the view to a given node
    }

    // Afficher le rapport dans l'interface du plugin
    figma.ui.postMessage({ type: 'inventory', rapport });
  } catch (error) {
    console.error(error);
    console.log(rapport);
  }
}
