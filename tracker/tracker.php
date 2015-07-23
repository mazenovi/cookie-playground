<?php

require __DIR__ . '/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

$app   = new Silex\Application();
$stack = (new Stack\Builder())
    ->push('Asm89\Stack\Cors', [
        'allowedOrigins' => [ '*' ],
    ]);

$app->register(new Silex\Provider\TwigServiceProvider(), [
    'twig.path' => __DIR__ . '/views',
]);

// config
$app['cookie.name']     = 'tracker-cookie-name';
$app['cookie.lifetime'] = 0;
$app['config']          = new \YamlStorage(__DIR__ . '/config.yml');
$app['storage']         = new \YamlStorage(__DIR__ . '/data.yml');


$app->get('/dashboard', function (Request $request) use ($app) {
    if (!$request->cookies->has($app['cookie.name'])) {
        return 'No data yet...';
    }

    $data = $app['storage']->all();

    return $app['twig']->render('index.html.twig', [
        'data'      => $data,
    ]);
});

$app->get('/img.gif', function (Request $request) use ($app) {
    if (!$request->server->has('HTTP_REFERER')) {
        throw new NotFoundHttpException();
    }

    $response = new GifResponse();
    $config = $app['config']->all();
    if($config['tracker']['strategy'] == 'cookie') {
        if (!$request->cookies->has($app['cookie.name'])) {
            $id = mt_rand();

            $response->setCookie(
                $app['cookie.name'],
                $id,
                $app['cookie.lifetime']
            );
        } else {
            $id = $request->cookies->get($app['cookie.name']);
        }
    } elseif($config['tracker']['strategy'] == 'adid') {
        // those elements make each browser unique 
        // See https://panopticlick.eff.org
        $id = $request->server->get('HTTP_USER_AGENT');
        $id .= $request->server->get('HTTP_ACCEPT');
        $id .= $request->query->get('browser_plugin');
        $id .= $request->query->get('time_zone');
        $id .= $request->query->get('screen_width').'x'.$request->query->get('screen_height').'x'.$request->query->get('screen_scope');
        $id .= $request->query->get('system_fonts');
        $id .= $request->query->get('cookie_enabled');
        $id = md5($id);
    }
    $app['storage']->set(
        $id,
        new \DateTime(),
        array('tracker' => $config['tracker'], 'query' => $request->query->all(), 'server' => $request->server->all())
    );

    return $response;
});

return $stack->resolve($app);
