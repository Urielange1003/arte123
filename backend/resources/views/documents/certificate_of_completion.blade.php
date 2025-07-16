<!DOCTYPE html>
<html>
<head>
    <title>Attestation de Fin de Stage - CAMRAIL</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
        }
        .container {
            width: 100%;
            margin: 0 auto;
            padding: 30px;
            box-sizing: border-box;
        }
        .header {
            text-align: center;
            margin-bottom: 60px;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #003366;
            margin: 0;
            font-size: 28pt;
        }
        .header p {
            margin: 5px 0;
            font-size: 14pt;
            font-weight: bold;
            color: #555;
        }
        .content {
            margin-top: 40px;
            text-align: center;
            line-height: 2.0; /* Augmenté pour l'espacement du certificat */
        }
        .content p {
            margin-bottom: 15px;
        }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .underline { text-decoration: underline; }
        .section-title {
            margin-top: 40px;
            margin-bottom: 20px;
            font-size: 14pt;
            color: #003366;
            text-decoration: underline;
        }
        .signature {
            margin-top: 80px;
            text-align: right;
            font-size: 11pt;
        }
        .signature strong {
            display: block;
            margin-bottom: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            border-top: 1px solid #eee;
            padding-top: 15px;
            font-size: 9pt;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ATTESTATION DE FIN DE STAGE</h1>
            <p>Délivrée par {{ $companyName }}</p>
        </div>

        <div class="content">
            <p>Nous soussignés, **{{ $companyName }}**, certifions que :</p>
            <p class="bold" style="font-size: 18pt;">Monsieur/Madame {{ $stagiaireName }}</p>
            <p>A effectué un stage au sein de notre entreprise</p>
            <p>Du <span class="underline bold">{{ $stageData['startDate'] }}</span> au <span class="underline bold">{{ $stageData['endDate'] }}</span>,</p>
            <p>Soit une durée de <span class="bold">{{ $stageData['durationMonths'] }} mois</span>.</p>
            <p>Durant cette période, il/elle a participé activement aux activités du département <span class="italic">{{ $stageData['department'] }}</span>, notamment à :</p>
            <p style="white-space: pre-line; text-align: left; margin-left: 20%; margin-right: 20%;">
                - {{ $stageData['tasksPerformed'] }}
            </p>
            <p>Son comportement et sa capacité d'adaptation ont été <span class="bold">{{ $stageData['appreciation'] }}</span>.</p>
            <br>
            <p>En foi de quoi, la présente attestation lui est délivrée pour servir et valoir ce que de droit.</p>
        </div>

        <div class="signature">
            <p>Fait à {{ $stageData['signatureLocation'] }}, le {{ $currentDate }}</p>
            <p>Pour la Direction,</p>
            <strong>{{ $rhName }}</strong>
            <p>{{ $rhTitle }}</p>
            <p>{{ $companyName }}</p>
        </div>

        <div class="footer">
            <p>{{ $companyName }} - Siège Social : [Adresse Complète]</p>
            <p>Tel: [Numéro de Téléphone] - Email: [Email de Contact]</p>
        </div>
    </div>
</body>
</html>