document.addEventListener('DOMContentLoaded', () => {

    // Tab items (SUP IGR, SAM IGR, SM IGR, MSJM IGR)
    const tabItems = document.querySelectorAll('.tab-item');
    // Kontainer list nama email di panel kiri
    const nameListContainer = document.getElementById('name-list');
    // Input pencarian
    const searchInput = document.getElementById('searchInput');
    
    // Bagian output email di panel kanan
    const emailDisplay = document.getElementById('email-display');
    const copyBtn = document.getElementById('copy-btn');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const clearBtn = document.getElementById('clear-btn'); // Pastikan ini sudah ada di HTML

    const rightPanel = document.querySelector('.right-panel'); 
    const motorContainer = document.querySelector('.motor-container');

    // Di sini kita siapkan container untuk sub tab
    const subTabSection = document.querySelector('.sub-tab-section');

    // ---------------------------------------------
    // DATA SUB TAB (Contoh)
    // ---------------------------------------------
    const subTabData = {
    // division1 = SUP
    division1: [
        {
        key: 'jawa',
        label: 'SUP JAWA',
        members: [
            { name: 'SUP YOG', email: 'support@yog.indogrosir.co.id' },
            { name: 'SUP SBY', email: 'support@sby.indogrosir.co.id' },
            { name: 'SUP KMY', email: 'support@kmy.indogrosir.co.id' },
            { name: 'SUP CPG', email: 'support@cpg.indogrosir.co.id' },
            { name: 'SUP BGR', email: 'support@bgr.indogrosir.co.id' },
            { name: 'SUP TGR', email: 'support@tgr.indogrosir.co.id' },
            { name: 'SUP CPT', email: 'support@cpt.indogrosir.co.id' },
            { name: 'SUP KRW', email: 'support@krw.indogrosir.co.id' },
            { name: 'SUP BKS', email: 'support@bks.indogrosir.co.id' },
            { name: 'SUP CKL', email: 'support@ckl.indogrosir.co.id' },
            { name: 'SUP BDG', email: 'support@bdg.indogrosir.co.id' },
            { name: 'SUP MLG', email: 'support@mlg.indogrosir.co.id' },
            { name: 'SUP SBI', email: 'support@sbi.indogrosir.co.id' },
            { name: 'SUP SLO', email: 'support@slo.indogrosir.co.id' },
            { name: 'SUP SMG', email: 'support@smg.indogrosir.co.id' },
            { name: 'SUP PWT', email: 'support@pwt.indogrosir.co.id' },
            // tambahkan lagi...
        ]
        },
        {
            key: 'jawa',
            label: 'SUP JAWA kecuali DKI',
            members: [
                { name: 'SUP YOG', email: 'support@yog.indogrosir.co.id' },
                { name: 'SUP SBY', email: 'support@sby.indogrosir.co.id' },
                { name: 'SUP BDG', email: 'support@bdg.indogrosir.co.id' },
                { name: 'SUP MLG', email: 'support@mlg.indogrosir.co.id' },
                { name: 'SUP SBI', email: 'support@sbi.indogrosir.co.id' },
                { name: 'SUP SLO', email: 'support@slo.indogrosir.co.id' },
                { name: 'SUP SMG', email: 'support@smg.indogrosir.co.id' },
                { name: 'SUP PWT', email: 'support@pwt.indogrosir.co.id' },
                // tambahkan lagi...
            ]
            },
        {
        key: 'dki',
        label: 'SUP DKI',
        members: [
            { name: 'SUP KMY', email: 'support@kmy.indogrosir.co.id' },
            { name: 'SUP CPG', email: 'support@cpg.indogrosir.co.id' },
            { name: 'SUP BGR', email: 'support@bgr.indogrosir.co.id' },
            { name: 'SUP TGR', email: 'support@tgr.indogrosir.co.id' },
            { name: 'SUP CPT', email: 'support@cpt.indogrosir.co.id' },
            { name: 'SUP KRW', email: 'support@krw.indogrosir.co.id' },
            { name: 'SUP BKS', email: 'support@bks.indogrosir.co.id' }
            // tambahkan lagi...
        ]
        },
        {
        key: 'kalimantan',
        label: 'SUP KAL',
        members: [
            { name: 'SUP BMS', email: 'support@bms.indogrosir.co.id' },
            { name: 'SUP SMD', email: 'support@smd.indogrosir.co.id' },
            { name: 'SUP PTK', email: 'support@ptk.indogrosir.co.id' },
        ]
        },
        {
        key: 'sulawesi',
        label: 'SUP SUL',
        members: [
            { name: 'SUP KRI', email: 'support@kri.indogrosir.co.id' },
            { name: 'SUP MDO', email: 'support@mdo.indogrosir.co.id' },
            { name: 'SUP MKS', email: 'support@mks.indogrosir.co.id' },
            { name: 'SUP GTO', email: 'support@gto.indogrosir.co.id' }
        ]
        },
        {
            key: 'sumatera',
            label: 'SUP SUM',
            members: [
                { name: 'SUP BTM', email: 'support@btm.indogrosir.co.id' },
                { name: 'SUP BDL', email: 'support@bdl.indogrosir.co.id' },
                { name: 'SUP JBI', email: 'support@jbi.indogrosir.co.id' },
                { name: 'SUP MDN', email: 'support@mdn.indogrosir.co.id' },
                { name: 'SUP PKU', email: 'support@pku.indogrosir.co.id' },
                { name: 'SUP PLG', email: 'support@plg.indogrosir.co.id' },
            ]
        },
        {
            key: 'maluku',
            label: 'SUP MAL',
            members: [
                { name: 'SUP AMB', email: 'support@amb.indogrosir.co.id' },
            ]
        },
    ],

    // division2 = SAM
    division2: [
        {
            key: 'jawa',
            label: 'SAM JAWA',
            members: [
                { name: 'SAM YOG', email: 'sam@yog.indogrosir.co.id' },
                { name: 'SAM SBY', email: 'sam@sby.indogrosir.co.id' },
                { name: 'SAM KMY', email: 'sam@kmy.indogrosir.co.id' },
                { name: 'SAM CPG', email: 'sam@cpg.indogrosir.co.id' },
                { name: 'SAM BGR', email: 'sam@bgr.indogrosir.co.id' },
                { name: 'SAM TGR', email: 'sam@tgr.indogrosir.co.id' },
                { name: 'SAM CPT', email: 'sam@cpt.indogrosir.co.id' },
                { name: 'SAM KRW', email: 'sam@krw.indogrosir.co.id' },
                { name: 'SAM BKS', email: 'sam@bks.indogrosir.co.id' },
                { name: 'SAM CKL', email: 'sam@ckl.indogrosir.co.id' },
                { name: 'SAM BDG', email: 'sam@bdg.indogrosir.co.id' },
                { name: 'SAM MLG', email: 'sam@mlg.indogrosir.co.id' },
                { name: 'SAM SBI', email: 'sam@sbi.indogrosir.co.id' },
                { name: 'SAM SLO', email: 'sam@slo.indogrosir.co.id' },
                { name: 'SAM SMG', email: 'sam@smg.indogrosir.co.id' },
                { name: 'SAM PWT', email: 'sam@pwt.indogrosir.co.id' },
                // tambahkan lagi...
            ]
            },
            {
                key: 'jawa',
                label: 'SAM JAWA kecuali DKI',
                members: [
                    { name: 'SAM YOG', email: 'sam@yog.indogrosir.co.id' },
                    { name: 'SAM SBY', email: 'sam@sby.indogrosir.co.id' },
                    { name: 'SAM BDG', email: 'sam@bdg.indogrosir.co.id' },
                    { name: 'SAM MLG', email: 'sam@mlg.indogrosir.co.id' },
                    { name: 'SAM SBI', email: 'sam@sbi.indogrosir.co.id' },
                    { name: 'SAM SLO', email: 'sam@slo.indogrosir.co.id' },
                    { name: 'SAM SMG', email: 'sam@smg.indogrosir.co.id' },
                    { name: 'SAM PWT', email: 'sam@pwt.indogrosir.co.id' },
                    // tambahkan lagi...
                ]
                },
            {
            key: 'dki',
            label: 'SAM DKI',
            members: [
                { name: 'SAM KMY', email: 'sam@kmy.indogrosir.co.id' },
                { name: 'SAM CPG', email: 'sam@cpg.indogrosir.co.id' },
                { name: 'SAM BGR', email: 'sam@bgr.indogrosir.co.id' },
                { name: 'SAM TGR', email: 'sam@tgr.indogrosir.co.id' },
                { name: 'SAM CPT', email: 'sam@cpt.indogrosir.co.id' },
                { name: 'SAM KRW', email: 'sam@krw.indogrosir.co.id' },
                { name: 'SAM BKS', email: 'sam@bks.indogrosir.co.id' }
                // tambahkan lagi...
            ]
            },
            {
            key: 'kalimantan',
            label: 'SAM KAL',
            members: [
                { name: 'SAM BMS', email: 'sam@bms.indogrosir.co.id' },
                { name: 'SAM SMD', email: 'sam@smd.indogrosir.co.id' },
                { name: 'SAM PTK', email: 'sam@ptk.indogrosir.co.id' },
            ]
            },
            {
            key: 'sulawesi',
            label: 'SAM SUL',
            members: [
                { name: 'SAM KRI', email: 'sam@kri.indogrosir.co.id' },
                { name: 'SAM MDO', email: 'sam@mdo.indogrosir.co.id' },
                { name: 'SAM MKS', email: 'sam@mks.indogrosir.co.id' },
                { name: 'SAM GTO', email: 'sam@gto.indogrosir.co.id' }
            ]
            },
            {
                key: 'sumatera',
                label: 'SAM SUM',
                members: [
                    { name: 'SAM BTM', email: 'sam@btm.indogrosir.co.id' },
                    { name: 'SAM BDL', email: 'sam@bdl.indogrosir.co.id' },
                    { name: 'SAM JBI', email: 'sam@jbi.indogrosir.co.id' },
                    { name: 'SAM MDN', email: 'sam@mdn.indogrosir.co.id' },
                    { name: 'SAM PKU', email: 'sam@pku.indogrosir.co.id' },
                    { name: 'SAM PLG', email: 'sam@plg.indogrosir.co.id' },
                ]
            },
            {
                key: 'maluku',
                label: 'SAM MAL',
                members: [
                    { name: 'SAM AMB', email: 'sam@amb.indogrosir.co.id' },
                ]
            },
        // tambahkan sub-tab lain (Sumatra, Sulawesi, dsb.) sesuai kebutuhan
    ],

    // division3 = SM
    division3: [
        {
            key: 'jawa',
            label: 'SM JAWA',
            members: [
                { name: 'SM YOG', email: 'sm@yog.indogrosir.co.id' },
                { name: 'SM SBY', email: 'sm@sby.indogrosir.co.id' },
                { name: 'SM KMY', email: 'sm@kmy.indogrosir.co.id' },
                { name: 'SM CPG', email: 'sm@cpg.indogrosir.co.id' },
                { name: 'SM BGR', email: 'sm@bgr.indogrosir.co.id' },
                { name: 'SM TGR', email: 'sm@tgr.indogrosir.co.id' },
                { name: 'SM CPT', email: 'sm@cpt.indogrosir.co.id' },
                { name: 'SM KRW', email: 'sm@krw.indogrosir.co.id' },
                { name: 'SM BKS', email: 'sm@bks.indogrosir.co.id' },
                { name: 'SM CKL', email: 'sm@ckl.indogrosir.co.id' },
                { name: 'SM BDG', email: 'sm@bdg.indogrosir.co.id' },
                { name: 'SM MLG', email: 'sm@mlg.indogrosir.co.id' },
                { name: 'SM SBI', email: 'sm@sbi.indogrosir.co.id' },
                { name: 'SM SLO', email: 'sm@slo.indogrosir.co.id' },
                { name: 'SM SMG', email: 'sm@smg.indogrosir.co.id' },
                { name: 'SM PWT', email: 'sm@pwt.indogrosir.co.id' },
                // tambahkan lagi...
            ]
            },
            {
                key: 'jawa',
                label: 'SM JAWA kecuali DKI',
                members: [
                    { name: 'SM YOG', email: 'sm@yog.indogrosir.co.id' },
                    { name: 'SM SBY', email: 'sm@sby.indogrosir.co.id' },
                    { name: 'SM BDG', email: 'sm@bdg.indogrosir.co.id' },
                    { name: 'SM MLG', email: 'sm@mlg.indogrosir.co.id' },
                    { name: 'SM SBI', email: 'sm@sbi.indogrosir.co.id' },
                    { name: 'SM SLO', email: 'sm@slo.indogrosir.co.id' },
                    { name: 'SM SMG', email: 'sm@smg.indogrosir.co.id' },
                    { name: 'SM PWT', email: 'sm@pwt.indogrosir.co.id' },
                    // tambahkan lagi...
                ]
                },
            {
            key: 'dki',
            label: 'SM DKI',
            members: [
                { name: 'SM KMY', email: 'sm@kmy.indogrosir.co.id' },
                { name: 'SM CPG', email: 'sm@cpg.indogrosir.co.id' },
                { name: 'SM BGR', email: 'sm@bgr.indogrosir.co.id' },
                { name: 'SM TGR', email: 'sm@tgr.indogrosir.co.id' },
                { name: 'SM CPT', email: 'sm@cpt.indogrosir.co.id' },
                { name: 'SM KRW', email: 'sm@krw.indogrosir.co.id' },
                { name: 'SM BKS', email: 'sm@bks.indogrosir.co.id' }
                // tambahkan lagi...
            ]
            },
            {
            key: 'kalimantan',
            label: 'SM KAL',
            members: [
                { name: 'SM BMS', email: 'sm@bms.indogrosir.co.id' },
                { name: 'SM SMD', email: 'sm@smd.indogrosir.co.id' },
                { name: 'SM PTK', email: 'sm@ptk.indogrosir.co.id' },
            ]
            },
            {
            key: 'sulawesi',
            label: 'SM SUL',
            members: [
                { name: 'SM KRI', email: 'sm@kri.indogrosir.co.id' },
                { name: 'SM MDO', email: 'sm@mdo.indogrosir.co.id' },
                { name: 'SM MKS', email: 'sm@mks.indogrosir.co.id' },
                { name: 'SM GTO', email: 'sm@gto.indogrosir.co.id' }
            ]
            },
            {
                key: 'sumatera',
                label: 'SM SUM',
                members: [
                    { name: 'SM BTM', email: 'sm@btm.indogrosir.co.id' },
                    { name: 'SM BDL', email: 'sm@bdl.indogrosir.co.id' },
                    { name: 'SM JBI', email: 'sm@jbi.indogrosir.co.id' },
                    { name: 'SM MDN', email: 'sm@mdn.indogrosir.co.id' },
                    { name: 'SM PKU', email: 'sm@pku.indogrosir.co.id' },
                    { name: 'SM PLG', email: 'sm@plg.indogrosir.co.id' },
                ]
            },
            {
                key: 'maluku',
                label: 'SM MAL',
                members: [
                    { name: 'SM AMB', email: 'sm@amb.indogrosir.co.id' },
                ]
            },
        // tambahkan sub-tab lain
    ],

    // division4 = MSJM
    division4: [
        {
            key: 'jawa',
            label: 'MSJM JAWA',
            members: [
                { name: 'MSJM YOG', email: 'msjm@yog.indogrosir.co.id' },
                { name: 'MSJM SBY', email: 'msjm@sby.indogrosir.co.id' },
                { name: 'MSJM KMY', email: 'msjm@kmy.indogrosir.co.id' },
                { name: 'MSJM CPG', email: 'msjm@cpg.indogrosir.co.id' },
                { name: 'MSJM BGR', email: 'msjm@bgr.indogrosir.co.id' },
                { name: 'MSJM TGR', email: 'msjm@tgr.indogrosir.co.id' },
                { name: 'MSJM CPT', email: 'msjm@cpt.indogrosir.co.id' },
                { name: 'MSJM KRW', email: 'msjm@krw.indogrosir.co.id' },
                { name: 'MSJM BKS', email: 'msjm@bks.indogrosir.co.id' },
                { name: 'MSJM CKL', email: 'msjm@ckl.indogrosir.co.id' },
                { name: 'MSJM BDG', email: 'msjm@bdg.indogrosir.co.id' },
                { name: 'MSJM MLG', email: 'msjm@mlg.indogrosir.co.id' },
                { name: 'MSJM SBI', email: 'msjm@sbi.indogrosir.co.id' },
                { name: 'MSJM SLO', email: 'msjm@slo.indogrosir.co.id' },
                { name: 'MSJM SMG', email: 'msjm@smg.indogrosir.co.id' },
                { name: 'MSJM PWT', email: 'msjm@pwt.indogrosir.co.id' },
                // tambahkan lagi...
            ]
            },
            {
                key: 'jawa',
                label: 'MSJM JAWA kecuali DKI',
                members: [
                    { name: 'MSJM YOG', email: 'msjm@yog.indogrosir.co.id' },
                    { name: 'MSJM SBY', email: 'msjm@sby.indogrosir.co.id' },
                    { name: 'MSJM BDG', email: 'msjm@bdg.indogrosir.co.id' },
                    { name: 'MSJM MLG', email: 'msjm@mlg.indogrosir.co.id' },
                    { name: 'MSJM SBI', email: 'msjm@sbi.indogrosir.co.id' },
                    { name: 'MSJM SLO', email: 'msjm@slo.indogrosir.co.id' },
                    { name: 'MSJM SMG', email: 'msjm@smg.indogrosir.co.id' },
                    { name: 'MSJM PWT', email: 'msjm@pwt.indogrosir.co.id' },
                    // tambahkan lagi...
                ]
                },
            {
            key: 'dki',
            label: 'MSJM DKI',
            members: [
                { name: 'MSJM KMY', email: 'msjm@kmy.indogrosir.co.id' },
                { name: 'MSJM CPG', email: 'msjm@cpg.indogrosir.co.id' },
                { name: 'MSJM BGR', email: 'msjm@bgr.indogrosir.co.id' },
                { name: 'MSJM TGR', email: 'msjm@tgr.indogrosir.co.id' },
                { name: 'MSJM CPT', email: 'msjm@cpt.indogrosir.co.id' },
                { name: 'MSJM KRW', email: 'msjm@krw.indogrosir.co.id' },
                { name: 'MSJM BKS', email: 'msjm@bks.indogrosir.co.id' }
                // tambahkan lagi...
            ]
            },
            {
            key: 'kalimantan',
            label: 'MSJM KAL',
            members: [
                { name: 'MSJM BMS', email: 'msjm@bms.indogrosir.co.id' },
                { name: 'MSJM SMD', email: 'msjm@smd.indogrosir.co.id' },
                { name: 'MSJM PTK', email: 'msjm@ptk.indogrosir.co.id' },
            ]
            },
            {
            key: 'sulawesi',
            label: 'MSJM SUL',
            members: [
                { name: 'MSJM KRI', email: 'msjm@kri.indogrosir.co.id' },
                { name: 'MSJM MDO', email: 'msjm@mdo.indogrosir.co.id' },
                { name: 'MSJM MKS', email: 'msjm@mks.indogrosir.co.id' },
                { name: 'MSJM GTO', email: 'msjm@gto.indogrosir.co.id' }
            ]
            },
            {
                key: 'sumatera',
                label: 'MSJM SUM',
                members: [
                    { name: 'MSJM BTM', email: 'msjm@btm.indogrosir.co.id' },
                    { name: 'MSJM BDL', email: 'msjm@bdl.indogrosir.co.id' },
                    { name: 'MSJM JBI', email: 'msjm@jbi.indogrosir.co.id' },
                    { name: 'MSJM MDN', email: 'msjm@mdn.indogrosir.co.id' },
                    { name: 'MSJM PKU', email: 'msjm@pku.indogrosir.co.id' },
                    { name: 'MSJM PLG', email: 'msjm@plg.indogrosir.co.id' },
                ]
            },
            {
                key: 'maluku',
                label: 'MSJM MAL',
                members: [
                    { name: 'MSJM AMB', email: 'msjm@amb.indogrosir.co.id' },
                ]
            },
        // tambahkan sub-tab lain
    ]
    };

    // ---------------------------------------------
    // Variabel global data
    // ---------------------------------------------
    let allData = {};
    // Menampung nama-nama (lintas divisi) yang dipilih
    let selectedNames = [];
    // Divisi yang sedang aktif
    let currentDivision = 'division1';
    // Sub tab yang sedang aktif (null = tidak ada)
    let currentSubTab = null;

    // ---------------------------------------------
    // Fetch data dari JSON (data utama)
    // ---------------------------------------------
    fetch('assets/list/cabangdata.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            // Tampilkan data default (tanpa sub tab)
            displayNames(currentDivision, '');
        })
        .catch(error => console.error('Error loading JSON:', error));

    // ---------------------------------------------
    // Fungsi menampilkan sub-tab (dinamis)
    // ---------------------------------------------
    function createSubTabsForDivision(divisionKey) {
    const ul = document.createElement('ul');
    ul.classList.add('sub-tab-list');
    ul.id = `sub-tab-${divisionKey}`;
    ul.style.display = 'none';

    const subTabs = subTabData[divisionKey];
    if (subTabs) {
        subTabs.forEach(sub => {
        const li = document.createElement('li');
        li.classList.add('sub-tab-item');
        li.textContent = sub.label;
        li.setAttribute('data-subKey', sub.key);

        // Saat sub-tab di-klik
        li.addEventListener('click', () => {
            // 1. Tandai sub-tab mana yang aktif
            const siblings = ul.querySelectorAll('.sub-tab-item');
            siblings.forEach(item => item.classList.remove('active'));
            li.classList.add('active');

            // 2. Simpan sub tab aktif di variable global
            currentSubTab = sub; 
            // 3. Tampilkan data sub-tab ini di panel kiri
            displaySubTabMembers(sub.members);
        });

        ul.appendChild(li);
        });
    }

    return ul;
    }

    function displaySubTabMembers(members) {
    // Bersihkan name-list
    nameListContainer.innerHTML = '';

    members.forEach(item => {
        const nameItem = document.createElement('div');
        nameItem.classList.add('name-item');
        nameItem.textContent = item.name;
        nameItem.setAttribute('data-email', item.email);

        // Tandai jika sudah terpilih di selectedNames
        if (selectedNames.find(sel => sel.name === item.name && sel.email === item.email)) {
        nameItem.classList.add('selected');
        }

        // Klik item => toggle pilih/batal
        nameItem.addEventListener('click', () => {
        setTimeout(() => {
            rightPanel.classList.add('active');
            motorContainer.classList.add('hidden');
        }, 10); // Delay untuk memastikan transisi terlihat
        if (nameItem.classList.contains('selected')) {
            nameItem.classList.remove('selected');
            removeSelectedName(item);
        } else {
            nameItem.classList.add('selected');
            addSelectedName(item);
        }
        displayEmails();
        });

        nameListContainer.appendChild(nameItem);
    });
    }

    // Generate sub-tab untuk semua division
    Object.keys(subTabData).forEach(divisionKey => {
        const subTabUl = createSubTabsForDivision(divisionKey);
        subTabSection.appendChild(subTabUl);
        // Tampilkan sub-tab untuk division1 (currentDivision)
        const defaultSubTabUl = document.getElementById(`sub-tab-${currentDivision}`);
        if (defaultSubTabUl) {
            // Supaya terlihat, set display sub-tab jadi 'flex'
            defaultSubTabUl.style.display = 'flex';
            
            // Tidak ada sub-tab yang di-set "active" dan
            // TIDAK memanggil displaySubTabMembers() di sini
            // agar benar-benar tidak ada sub-tab yang langsung terbuka.
        }

    });

    // ---------------------------------------------
    // Fungsi untuk menampilkan data bawaan JSON
    // ---------------------------------------------
    function displayNames(divisionKey, filter) {
    currentSubTab = null; // reset sub-tab active
    // Bersihkan name-list
    nameListContainer.innerHTML = '';

    // Jika data divisionKey tidak ada, berhenti
    if (!allData[divisionKey]) return;

    // Filter berdasarkan teks pencarian
    const filteredData = allData[divisionKey].filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase())
    );

    // Render item
    filteredData.forEach(item => {
        const nameItem = document.createElement('div');
        nameItem.classList.add('name-item');
        nameItem.textContent = item.name;
        nameItem.setAttribute('data-email', item.email);

        // Tandai jika sudah terpilih di selectedNames
        if (selectedNames.find(sel => sel.name === item.name && sel.email === item.email)) {
            nameItem.classList.add('selected');
        }

        // Klik item => toggle pilih/batal
        nameItem.addEventListener('click', () => {
            setTimeout(() => {
                rightPanel.classList.add('active');
                motorContainer.classList.add('hidden');
            }, 10); // Delay untuk memastikan transisi terlihat
            if (nameItem.classList.contains('selected')) {
                nameItem.classList.remove('selected');
                removeSelectedName(item);
            } else {
                nameItem.classList.add('selected');
                addSelectedName(item);
            }
            displayEmails();
        });

        nameListContainer.appendChild(nameItem);
    });
    }

    // ---------------------------------------------
    // Tambah/hapus item dari selectedNames
    // ---------------------------------------------
    function addSelectedName(item) {
    const exists = selectedNames.find(sel => sel.name === item.name && sel.email === item.email);
    if (!exists) {
        selectedNames.push(item);
    }
    }

    function removeSelectedName(item) {
    selectedNames = selectedNames.filter(sel => {
        return sel.name !== item.name || sel.email !== item.email;
    });
    }

    // ---------------------------------------------
    // Tampilkan email terpilih di panel kanan
    // ---------------------------------------------
    function displayEmails() {
        const emailList = selectedNames.map(obj => obj.email);
        if (emailList.length > 0) {
            emailDisplay.textContent = emailList.join('; ') + ';';
        } else {
            emailDisplay.textContent = ''; // Kosongkan jika tidak ada email
        }
    }

    // ---------------------------------------------
    // Pencarian
    // ---------------------------------------------
    searchInput.addEventListener('input', () => {
    const filterValue = searchInput.value.trim();
    // Jika sedang ada sub-tab aktif, tampilkan sub-tab data
    if (currentSubTab) {
        // Filter data sub-tab
        const filtered = currentSubTab.members.filter(item =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
        );
        displaySubTabMembers(filtered);
    } else {
        // Jika tidak ada sub-tab, gunakan data main
        displayNames(currentDivision, filterValue);
    }
    });

    // ---------------------------------------------
    // Event listener: Tab utama (SUP, SAM, SM, MSJM)
    // ---------------------------------------------
    tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
        // Nonaktifkan tab lama
        document.querySelector('.tab-item.active').classList.remove('active');
        // Aktifkan tab baru
        tab.classList.add('active');

        // Perbarui currentDivision
        currentDivision = tab.getAttribute('data-division');

        // Reset pencarian
        searchInput.value = '';

        // Tampilkan data default (dari JSON) di panel kiri
        displayNames(currentDivision, '');

        // Sembunyikan semua sub-tab
        const allSubTabLists = document.querySelectorAll('.sub-tab-list');
        allSubTabLists.forEach(ul => {
            ul.style.display = 'none';
            ul.querySelectorAll('.sub-tab-item').forEach(item => item.classList.remove('active'));
        });

        // Tampilkan sub-tab milik division yg aktif
        const activeSubTabUl = document.getElementById(`sub-tab-${currentDivision}`);
        if (activeSubTabUl) {
            activeSubTabUl.style.display = 'flex';
        }
    });
    });

    // ---------------------------------------------
    // Tombol "Select All" / "Unselect All" (hanya tab atau sub-tab aktif)
    // ---------------------------------------------
    selectAllBtn.addEventListener('click', () => {

        rightPanel.classList.remove('active'); // Reset animasi sebelum diaktifkan kembali
        motorContainer.classList.add('hidden'); // Sembunyikan GIF motor

        // Tampilkan panel kanan dengan animasi
        setTimeout(() => {
            rightPanel.classList.add('active');
            motorContainer.classList.add('hidden');
        }, 10); // Delay untuk memastikan transisi terlihat
    
    // Jika ada sub-tab aktif, select/unselect data sub-tab saja
    if (currentSubTab) {
        toggleSelectAllSubTab(currentDivision, currentSubTab);
    } else {
        // Jika tidak ada sub-tab, select/unselect data main tab
        toggleSelectAllMain(currentDivision);
    
    }
    });

    // Fungsi select/unselect di sub-tab aktif
    function toggleSelectAllSubTab(divisionKey, sub) {
    // Cek apakah semua item sub-tab sudah diselected
    const subEmails = sub.members.map(m => m.email);
    const allSelected = sub.members.every(m =>
        selectedNames.some(sel => sel.email === m.email)
    );

    if (!allSelected) {
        // Jika belum semua dipilih -> pilih semua
        sub.members.forEach(item => addSelectedName(item));
        
    } else {
        // Jika sudah semua dipilih -> unselect semua
        sub.members.forEach(item => removeSelectedName(item));
    }

    // Refresh panel kiri (sub-tab) dan panel kanan
    
    displaySubTabMembers(sub.members);
    displayEmails();
    }

    // Fungsi select/unselect di main tab
    function toggleSelectAllMain(divisionKey) {
    // data main tab
    const dataTab = allData[divisionKey] || [];
    // Cek apakah semua item main tab sudah diselected
    const allSelected = dataTab.every(m =>
        selectedNames.some(sel => sel.email === m.email)
    );

    if (!allSelected) {
        // Belum semua -> select all
        dataTab.forEach(item => addSelectedName(item));
    } else {
        // Sudah semua -> unselect all
        dataTab.forEach(item => removeSelectedName(item));
    }

    // Refresh panel kiri (main tab) dan panel kanan
    displayNames(divisionKey, searchInput.value);
    displayEmails();
    }

    // ---------------------------------------------
    // Tombol Clear All
    // ---------------------------------------------
    clearBtn.addEventListener('click', () => {
        selectedNames = [];
        // Reset tampilan email
        displayEmails();
        rightPanel.classList.remove('active');
        motorContainer.classList.remove('hidden');

        // Jika sedang lihat sub-tab, refresh sub-tab
        if (currentSubTab) {
            displaySubTabMembers(currentSubTab.members);
        } else {
            displayNames(currentDivision, searchInput.value);
        }
    });


    // ---------------------------------------------
    // Fungsi Copy ke Clipboard
    // ---------------------------------------------
    copyBtn.addEventListener('click', copyToClipboard);
    function copyToClipboard() {
        const textToCopy = emailDisplay.textContent;
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showPopup(`Email berhasil disalin, silakan paste di email draft anda.`);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });

    }

    function showPopup(message) {
        const popupOverlay = document.getElementById('popup-message');
        const popupText = document.getElementById('popup-text');
        
        // Tampilkan pesan di <p id="popup-text">
        popupText.textContent = message;
        
        // Tampilkan popup
        popupOverlay.style.display = 'flex';
        
        // Klik di luar konten = tutup popup
        popupOverlay.addEventListener('click', () => {
            // rightPanel.classList.remove('active');
            // motorContainer.classList.remove('hidden');
            popupOverlay.style.display = 'none';
        });
        
        // Mencegah popup menutup jika user klik tepat di area konten
        const popupContent = document.getElementById('popup-content');
        popupContent.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

});
