<!DOCTYPE html>
<html>
<head>
    <title>Lettre de stage</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; line-height: 1.6; }
        .container { width: 80%; margin: 0 auto; padding: 20px; }
        .header, .footer { text-align: center; margin-bottom: 30px; }
        .content { margin-top: 40px; }
        .signature { margin-top: 60px; text-align: right; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>CAMRAIL</h2>
            <p>Département des Ressources Humaines</p>
            <p>Yaoundé, le {{ $currentDate }}</p>
        </div>

        <div class="content">
            <p>Objet : Offre de stage</p>
            <br>
            <p>Madame, Monsieur {{ $stagiaireName }},</p>
            <p>Nous avons le plaisir de vous informer que votre candidature pour un stage au sein de notre entreprise, CAMRAIL, a été retenue.</p>
            <p>Ce stage débutera le **{{ $startDate }}** et se terminera le **{{ $endDate }}**.</p>
            <p>Durant cette période, vous aurez l'opportunité de mettre en pratique vos connaissances et d'acquérir une expérience précieuse dans un environnement professionnel dynamique.</p>
            <br>
            <p>Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.</p>
        </div>

        <div class="signature">
            <p>Le Responsable des Ressources Humaines,</p>
            <p>{{ $rhName }}</p>
            <p>CAMRAIL</p>
        </div>
    </div>
</body>
</html>