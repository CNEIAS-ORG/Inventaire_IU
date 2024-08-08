"use strict";
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-debugger */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
// This shows the HTML page in "ui.html".
// Affiche l'interface utilisateur du plugin
figma.showUI(__html__);
// Les appels à "parent.postMessage" depuis la page HTML déclencheront ce callback.
// Le callback recevra la propriété "pluginMessage" du message posté.
let rapport = 'INVENTAIRE DES COMPOSANTS' + '\n' + '\n'; // ancien page avec la nouvelle page
// Ensemble pour suivre les IDs traités
let processedIds = new Set();
let msg_1_String = "";
// Gestion des messages envoyés depuis l'interface utilisateur
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'create-inventory') {
        // Lancer la génération de l'inventaire
        listComposants();
    }
    ///////////Recherche composant//////////
    // Search component
    if (msg.type === 'display-composant-id-1') {
        msg_1_String = String(msg.count);
    }
    if (msg.type === 'display-composant-id-2') {
        let msg_2_String = msg.count;
        let msg_String = msg_1_String + ':' + msg_2_String;
        center_on_this(figma.currentPage, msg_String);
    }
    /////////////////
    if (msg.type === 'cancel') {
        // Fermer le plugin
        figma.closePlugin();
    }
});
// Fonction pour centrer sur un élément spécifique dans la page courante
function center_on_this(currentPage, msg_String) {
    return __awaiter(this, void 0, void 0, function* () {
        let nodes = currentPage.findAll(n => n.id === msg_String);
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes); // Zoomer la vue sur un nœud donné
    });
}
// Fonction pour lister tous les composants
function listComposants() {
    const currentPage = figma.currentPage; // Obtient la page active
    rapport += '\n' + 'Page : ' + currentPage.name.toUpperCase() + '\n'; // Ajoute le nom de la page au rapport
    rapport += '\n';
    rapport += '\n';
    // Réinitialiser l'ensemble des IDs traités pour éviter des doublons entre les pages
    processedIds.clear();
    // Itérer à travers tous les nœuds de la page courante
    for (const node of walkTree(currentPage)) {
        analyse_element(node);
    }
    // Assigner le texte du rapport à la page "Inventaire"
    assignText(currentPage.name);
}
// Fonction génératrice pour parcourir l'arbre des nœuds
function* walkTree(node) {
    yield node; // Retourner le nœud courant
    if ('children' in node) {
        for (const child of node.children) {
            yield* walkTree(child); // Retourner récursivement les enfants
        }
    }
}
// Fonction pour analyser un nœud
function analyse_element(layer, depth = 0) {
    // Vérifier si l'ID a déjà été traité
    if (processedIds.has(layer.id)) {
        return;
    }
    // Ajouter l'ID à l'ensemble des IDs traités
    processedIds.add(layer.id);
    // Ajouter une double ligne pour les groupes
    if (layer.type === 'GROUP' && depth > 0) {
        rapport += '\n'; // Ajouter une ligne vide pour séparer les groupes
    }
    // Ajouter les informations de base du nœud au rapport avec une indentation basée sur la profondeur
    rapport += `${'  '.repeat(depth)}${layer.type}\n`;
    rapport += `${'  '.repeat(depth)}Nom : ${layer.name} Id : ${layer.id}\n`;
    // Ajouter les dimensions si disponibles
    if ('width' in layer && 'height' in layer) {
        rapport += `${'  '.repeat(depth)}Position x : ${layer.x} Position y : ${layer.y} Height : ${layer.height} Width : ${layer.width}\n`;
    }
    // Analyser les enfants si le nœud est un groupe
    if ('children' in layer) {
        for (const child of layer.children) {
            analyse_element(child, depth + 1); // Analyser chaque enfant avec une indentation accrue
        }
    }
}
// Fonction pour assigner le texte du rapport à la page "Inventaire"
function assignText(pageName) {
    return __awaiter(this, void 0, void 0, function* () {
        // Nom unique pour la nouvelle page d'inventaire
        const inventoryPageName = `Inventaire - ${pageName}`;
        let inventoryPage = figma.root.findChild(node => node.name === inventoryPageName);
        try {
            if (inventoryPage === null) {
                // Créer une nouvelle page et y ajouter le rapport
                inventoryPage = figma.createPage();
                inventoryPage.name = inventoryPageName;
                const text = figma.createText();
                text.x = 50;
                text.y = 50;
                text.name = 'Rapport';
                yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
                text.characters = rapport;
                text.fontSize = 18;
                text.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
                inventoryPage.appendChild(text);
            }
            else {
                // Nettoyer le rapport existant sur la page "Inventaire"
                const inventaire_node = inventoryPage.findChildren(n => n.name.includes("Rapport"));
                if (inventaire_node.length > 0) {
                    const champ = inventaire_node[0];
                    if (champ.type === 'TEXT') {
                        yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
                        champ.characters = "";
                        champ.characters = rapport;
                    }
                }
            }
            // Sélectionner le nœud de texte du rapport
            if (inventoryPage !== null) {
                yield figma.setCurrentPageAsync(inventoryPage); // Installer la vue sur une page donnée
                const nodes = inventoryPage.findChildren(n => n.name.includes("Rapport"));
                figma.viewport.scrollAndZoomIntoView(nodes); // Zoomer la vue sur un nœud donné
            }
            // Afficher le rapport dans l'interface utilisateur du plugin
            figma.ui.postMessage({ type: 'inventory', rapport });
        }
        catch (error) {
            console.error(error);
            console.log(rapport);
        }
    });
}
